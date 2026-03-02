import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import * as cheerio from "cheerio";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing for proxy POST requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.raw({ type: "*/*" }));

  // Proxy API
  app.all("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    const adBlockEnabled = req.query.adblock === "true";
    const userAgentType = req.query.ua as string;
    const dntEnabled = req.query.dnt === "true";

    if (!targetUrl) {
      return res.status(400).send("URL is required");
    }

    try {
      let absoluteUrl = targetUrl;
      if (!targetUrl.startsWith("http")) {
        absoluteUrl = `https://${targetUrl}`;
      }

      const urlObj = new URL(absoluteUrl);

      // Filter and prepare headers
      const headers = { ...req.headers };
      delete headers.host;
      delete headers.origin;
      delete headers.referer;
      delete headers["accept-encoding"]; // Let axios handle decompression or request plain text
      
      // User Agent Rotation
      const userAgents: Record<string, string> = {
        safari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        firefox: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
        mobile: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        default: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      };
      headers["user-agent"] = userAgents[userAgentType] || userAgents.default;
      
      if (dntEnabled) {
        headers["dnt"] = "1";
      }

      const response = await axios({
        method: req.method,
        url: absoluteUrl,
        headers: headers as any,
        data: req.method !== "GET" ? req.body : undefined,
        responseType: "stream",
        validateStatus: () => true,
        maxRedirects: 5,
        timeout: 30000, // 30 second timeout
      });

      const contentType = response.headers["content-type"] || "";

      // Forward response headers (filtered)
      Object.entries(response.headers).forEach(([key, value]) => {
        const lowerKey = key.toLowerCase();
        // Remove security headers and encoding headers that we'll handle/change
        if (["content-security-policy", "x-frame-options", "content-encoding", "transfer-encoding", "content-length"].includes(lowerKey)) return;
        res.setHeader(key, value as string | string[]);
      });

      if (contentType.includes("text/html")) {
        let body = "";
        response.data.on("data", (chunk: any) => { body += chunk.toString(); });
        response.data.on("error", (err: any) => {
          console.error("Stream error:", err.message);
          if (!res.headersSent) res.status(500).send("Stream error");
        });
        response.data.on("end", () => {
          const $ = cheerio.load(body);
          const baseUrl = new URL(absoluteUrl);

          // Ad Blocking Logic
          if (adBlockEnabled) {
            const adSelectors = [
              "script[src*='adsbygoogle']",
              "script[src*='doubleclick']",
              "script[src*='amazon-adsystem']",
              "script[src*='adnxs']",
              "script[src*='adform']",
              "script[src*='taboola']",
              "script[src*='outbrain']",
              "script[src*='facebook.net/en_US/fbevents.js']",
              "script[src*='googletagmanager.com/gtm.js']",
              "iframe[src*='ads']",
              "ins.adsbygoogle",
              ".ad-container",
              "#ad-banner"
            ];
            adSelectors.forEach(selector => $(selector).remove());
          }

          // Comprehensive Rewriting
          $("[href], [src], [action], [srcset]").each((_, el) => {
            const $el = $(el);
            const attrs = ["href", "src", "action", "srcset"];
            
            attrs.forEach(attr => {
              const val = $el.attr(attr);
              if (!val) return;

              if (attr === "srcset") {
                const rewritten = val.split(",").map(part => {
                  const [url, size] = part.trim().split(/\s+/);
                  try {
                    return `${new URL(url, baseUrl.href).href} ${size || ""}`.trim();
                  } catch { return part; }
                }).join(", ");
                $el.attr(attr, rewritten);
              } else {
                try {
                  const resolved = new URL(val, baseUrl.href).href;
                  // Rewrite links and forms to go through proxy
                  if (attr === "href" || attr === "action") {
                    const isResource = /\.(css|js|png|jpg|jpeg|gif|svg|woff2?|ttf|otf)$/i.test(resolved.split("?")[0]);
                    if (!isResource || attr === "action") {
                      $el.attr(attr, `/api/proxy?url=${encodeURIComponent(resolved)}&adblock=${adBlockEnabled}&ua=${userAgentType}&dnt=${dntEnabled}`);
                    } else {
                      $el.attr(attr, resolved);
                    }
                  } else {
                    $el.attr(attr, resolved);
                  }
                } catch (e) { /* ignore */ }
              }
            });
          });

          // Rewrite CSS in <style> tags
          $("style").each((_, el) => {
            const css = $(el).text();
            const rewritten = css.replace(/url\(['"]?([^'"]+)['"]?\)/g, (match, url) => {
              try {
                return `url(${new URL(url, baseUrl.href).href})`;
              } catch { return match; }
            });
            $(el).text(rewritten);
          });

          // Inject proxy helper script
          $("head").prepend(`
            <script>
              // Intercept Fetch
              const originalFetch = window.fetch;
              window.fetch = function(url, options) {
                if (typeof url === 'string' && !url.startsWith('http') && !url.startsWith('/api/proxy')) {
                  url = new URL(url, "${baseUrl.href}").href;
                }
                return originalFetch(url, options);
              };

              // Intercept XHR
              const originalOpen = XMLHttpRequest.prototype.open;
              XMLHttpRequest.prototype.open = function(method, url) {
                if (typeof url === 'string' && !url.startsWith('http') && !url.startsWith('/api/proxy')) {
                  url = new URL(url, "${baseUrl.href}").href;
                }
                return originalOpen.apply(this, arguments);
              };

              // Intercept History API to keep proxy URL in sync
              const originalPushState = history.pushState;
              history.pushState = function(state, title, url) {
                if (url && !url.startsWith('http') && !url.startsWith('/api/proxy')) {
                  const resolved = new URL(url, "${baseUrl.href}").href;
                  const proxied = "/api/proxy?url=" + encodeURIComponent(resolved) + "&adblock=${adBlockEnabled}&ua=${userAgentType}&dnt=${dntEnabled}";
                  return originalPushState.call(this, state, title, proxied);
                }
                return originalPushState.apply(this, arguments);
              };

              // Handle relative links dynamically added to DOM
              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                      const elements = node.querySelectorAll('a, img, script, link');
                      elements.forEach(el => {
                        const attr = el.tagName === 'A' || el.tagName === 'LINK' ? 'href' : 'src';
                        const val = el.getAttribute(attr);
                        if (val && !val.startsWith('http') && !val.startsWith('/api/proxy') && !val.startsWith('data:')) {
                           try {
                             const resolved = new URL(val, "${baseUrl.href}").href;
                             if (el.tagName === 'A') {
                               el.setAttribute(attr, "/api/proxy?url=" + encodeURIComponent(resolved) + "&adblock=${adBlockEnabled}&ua=${userAgentType}&dnt=${dntEnabled}");
                             } else {
                               el.setAttribute(attr, resolved);
                             }
                           } catch(e) {}
                        }
                      });
                    }
                  });
                });
              });
              observer.observe(document.documentElement, { childList: true, subtree: true });
            </script>
          `);

          res.status(response.status).send($.html());
        });
      } else if (contentType.includes("text/css")) {
        let body = "";
        response.data.on("data", (chunk: any) => { body += chunk.toString(); });
        response.data.on("error", (err: any) => {
          console.error("CSS Stream error:", err.message);
          if (!res.headersSent) res.status(500).send("CSS Stream error");
        });
        response.data.on("end", () => {
          const rewritten = body.replace(/url\(['"]?([^'"]+)['"]?\)/g, (match, url) => {
            try {
              return `url(${new URL(url, absoluteUrl).href})`;
            } catch { return match; }
          });
          res.status(response.status).send(rewritten);
        });
      } else {
        // Stream binary/other data directly
        response.data.on("error", (err: any) => {
          console.error("Binary Stream error:", err.message);
          if (!res.headersSent) res.status(500).send("Binary Stream error");
        });
        response.data.pipe(res);
      }

    } catch (error: any) {
      console.error("Proxy error:", error.message);
      if (!res.headersSent) {
        res.status(500).send(`Proxy error: ${error.message}`);
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hunsy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
