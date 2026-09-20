/**
 * astruct.io home. The product shown as it is: the whole project read, the
 * paperwork done. A pinned hero where the desk arrives and does a job as
 * the reader scrolls; then the story in order: bring the project in and
 * ask; the finished letter; what it does; the contract forms it is built
 * for; Pip; the systems it connects to; Astruct against a general chatbot;
 * the close. Light or dark, the reader's choice, from the bar.
 */
import type { Metadata } from 'next'
import { AxRoot, AxHeader, AxFooter } from '@/components/site/ax-chrome'
import Hero from './hero'
import Story from './story'
import './landing.css'

export const metadata: Metadata = {
  title: { absolute: 'Astruct: your whole construction project, read; your paperwork, done' },
  description:
    'Upload the contract, drawings, emails and claims. Astruct reads every page, answers with the page it came from, and prepares the variations, notices, EOT claims and letters you have to send. Built for AS 4000, AS 4902, AS 2124 and the rest.',
}

export default function LandingPage() {
  return (
    <AxRoot>
      <AxHeader />
      <Hero />
      <Story />
      <AxFooter />
    </AxRoot>
  )
}
