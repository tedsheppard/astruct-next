/**
 * astruct.io home. The pitch is the product: the AI computer for
 * construction, shown as it is. The hero is pinned while the page scrolls
 * through it: the desk assembles from its parts (the dock, a contract open
 * in the viewer, the chat) as the reader scrolls, and settles into the real
 * screenshot. Then the story in order: give it a job; it reads the whole
 * project; where the project lives; watch it work; finished work; Pip;
 * programme, quantum and the model; voice; how it is kept. Real screens,
 * real words, no claims we cannot stand behind.
 */
import type { Metadata } from 'next'
import Hero from './hero'
import Story from './story'
import './landing.css'

export const metadata: Metadata = {
  title: { absolute: 'Astruct, the AI computer for construction' },
  description:
    'Give Astruct a job. It reads the whole project, drives its own computer, searches the web and the law, uses the systems your project lives in, and turns the instruction into finished work you can send.',
}

export default function LandingPage() {
  return (
    <div className="ax">
      <Hero />
      <Story />
    </div>
  )
}
