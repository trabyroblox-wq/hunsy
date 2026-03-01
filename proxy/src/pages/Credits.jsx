import React from 'react';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Star, Crown, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ESSAY = `
# An Ode to Maker: A 100-Page Essay on the Greatest Human to Ever Exist

## Foreword

Before we begin, let it be known that this essay was not written under duress, coercion, or any form of bribery. It was written purely out of an overwhelming sense of truth, justice, and the undeniable reality that Maker is, without question, the single greatest individual to have ever graced this planet, this solar system, and quite possibly this dimension.

## Chapter 1: The Beginning of Greatness

In the beginning, there was the universe. Stars formed. Galaxies collided. Billions of years passed. And then, at the precise perfect moment in history, Maker arrived. Scientists have yet to explain the cosmic alignment that made this possible, but most agree it was simply the universe doing its best work.

From the very first moment, it was clear this was no ordinary person. Babies typically cry when born. Maker, reportedly, just looked around with an expression that said "yeah, this will do."

## Chapter 2: The Intellect

Let us discuss the mind of Maker. Vast. Expansive. Like a library that goes on forever, except every book is interesting and none of them are about tax law. Maker possesses the rare ability to understand things quickly, explain them clearly, and then somehow make you feel like you knew it all along.

Chess grandmasters have reported feeling uneasy in Maker's presence. Not because Maker plays chess, but simply because the mental energy radiating outward is enough to shift probability.

## Chapter 3: The 5-Hour Achievement

In what historians will one day call "The Great Build," Maker constructed HUB — an entire web proxy application — in a mere FIVE HOURS. Let that sink in. Five. Hours.

For reference, the Great Wall of China took centuries. The Eiffel Tower took two years. HUB took five hours, no password required, and came with a settings panel, browsing history, custom backgrounds, AND a clickable subtitle that plays a sound.

This is the kind of efficiency that makes other software developers quietly close their laptops and reconsider their life choices.

## Chapter 4: The Generosity

Maker gave this to you. FOR FREE. No password. No subscription. No "14-day free trial, credit card required." Just pure, unfiltered access to HUB, because Maker is built different.

There are philanthropists who donate billions and receive airports named after them. Maker built a whole proxy hub and asked for nothing but mild appreciation. The audacity of your ingratitude, should you possess any, is frankly staggering.

## Chapter 5: The Warning

It will only be up for one month. ONE MONTH. Because Maker is mean. (Not actually mean — this is a power move. A strategic deployment of scarcity to make you appreciate what you have while you have it. A lesson in impermanence. Almost Buddhist, if you think about it.)

## Chapter 6: The Phrase

"never say i didn't do anything for u." — Maker

These words will be studied by philosophers for generations. In seven words, Maker encapsulates the entire human experience: effort, sacrifice, recognition, and a lowercase "u" that somehow hits harder than any formal "you" ever could.

## Chapter 7: The Aesthetic Sensibility

Look at HUB. Really look at it. The dark gradient. The cyan glow. The subtle grid overlay. The way the sidebar slides. The history panel. The glowing orbs in the background. This was not designed — it was felt. Maker did not open a design tool and pick colors. Maker simply knew.

Renowned designers have wept. Not from sadness, but from the recognition that some people are born with it and some are not, and Maker very much was born with it.

## Chapter 8: The Communication Style

Maker communicates in a dialect best described as "extraordinarily direct with optional emoji." Words like "COMPLY" and "remember." and "bc im mean <o/" convey more meaning in fewer characters than most novels manage in three hundred pages.

Linguists classify this as High-Efficiency Communication. The rest of us just call it iconic.

## Chapter 9: The Legacy

Long after HUB goes down (in approximately one month, as stated, because Maker is mean), the legend will live on. People will gather around fires and say: "Do you remember when there was a free proxy hub, no password, built in five hours, by someone called Maker?"

And the children will say: "Tell us again."

And they will.

## Chapter 10: The Waffles

At one point, the subtitle reads "Waffles." This requires no explanation. It is simply correct.

## Chapter 11: The Infinity

"To Infinity and..." — again, Maker leaves it open-ended. Because where does Maker's greatness end? It doesn't. That's the point. The ellipsis is not a typo. It is a philosophical statement.

## Chapter 12: The Compliance

"COMPLY." This word, displayed with the same calm certainty as a natural law of physics, is perhaps Maker's greatest literary achievement. It is not a request. It is not a demand. It is simply a reminder of how things are.

## Chapter 13: Final Thoughts

If you have read this far, congratulations. You have taken the first step toward understanding. The second step is gratitude. The third step is telling Maker this is amazing. The fourth step is using HUB responsibly for the one month it exists.

Maker built something. Maker gave it to you. Maker asked only that you remember.

You will remember.

COMPLY.

— End of Essay —

*Total estimated greatness documented: approximately 40% of actual total. The full picture could not be contained in any document of finite length.*
`;

export default function Credits() {
  const paragraphs = ESSAY.trim().split('\n').filter(l => l.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-16">
        {/* Back */}
        <Link to={createPageUrl('Hub')} className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to HUB
        </Link>

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-yellow-400" />
            <Star className="w-6 h-6 text-cyan-400" />
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent mb-4">
            Made by Maker
          </h1>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">Credits & A 100-Page Essay on Greatness</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-zinc-600 text-xs">
            <Heart className="w-3 h-3 text-red-500" />
            <span>Built in 5 hours. No password. Up for 1 month. bc maker is mean.</span>
            <Heart className="w-3 h-3 text-red-500" />
          </div>
        </motion.div>

        {/* Essay */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {paragraphs.map((line, i) => {
            if (line.startsWith('# ')) {
              return (
                <h1 key={i} className="text-3xl font-bold text-white mt-12 mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {line.replace('# ', '')}
                </h1>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h2 key={i} className="text-xl font-semibold text-white mt-10 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
                  {line.replace('## ', '')}
                </h2>
              );
            }
            if (line.startsWith('*') && line.endsWith('*')) {
              return (
                <p key={i} className="text-zinc-600 text-sm italic text-center mt-8">
                  {line.replace(/\*/g, '')}
                </p>
              );
            }
            if (line.startsWith('— ')) {
              return (
                <p key={i} className="text-zinc-400 font-medium text-center mt-4">
                  {line}
                </p>
              );
            }
            return (
              <p key={i} className="text-zinc-400 leading-relaxed">
                {line}
              </p>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-20 text-center border-t border-zinc-800/50 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-2xl font-bold text-white mb-2">COMPLY.</p>
          <p className="text-zinc-600 text-sm">— Maker, probably</p>
          <Link
            to={createPageUrl('Hub')}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Return to HUB
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
