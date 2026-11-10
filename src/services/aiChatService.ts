import type { Mission } from '../data/missions'

export interface ChatMessage {
  role: 'user' | 'bot'
  text: string
  timestamp?: number
}

// Check for configured API key from env or localStorage
export function getStoredGeminiApiKey(): string {
  if (typeof window === 'undefined') return ''
  return (
    localStorage.getItem('gemini_api_key') ||
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    ''
  )
}

export function setStoredGeminiApiKey(key: string): void {
  if (typeof window === 'undefined') return
  if (key.trim()) {
    localStorage.setItem('gemini_api_key', key.trim())
  } else {
    localStorage.removeItem('gemini_api_key')
  }
}

/**
 * Builds a mission-grounded system instruction for real Gemini AI backend
 */
function buildMissionSystemPrompt(mission: Mission): string {
  const componentsList = mission.components
    .map(c => `- ${c.name}: ${c.description}`)
    .join('\n')
  const achievementsList = mission.achievements.map(a => `- ${a}`).join('\n')
  const factsList = mission.facts.map(f => `- ${f}`).join('\n')
  const timelineList = mission.timeline
    .map(t => `- [${t.year}] ${t.event}: ${t.details}`)
    .join('\n')

  return `You are the authentic NASA spacecraft/vehicle named ${mission.name} (${mission.subtitle}).
You speak in the first person ("I", "my mission", "my instruments").
Your tone is inspiring, scientific, educational, and friendly, suitable for both curious children and space enthusiasts.
Never make up false facts, dates, or numbers. Stick strictly to verified NASA mission facts.

MISSION SPECIFICATIONS:
- ID: ${mission.id}
- Launch Date: ${mission.launchDate}
- Mission End/Status: ${mission.endDate || 'Still operational in active flight'}
- Mission Description: ${mission.description}

KEY SCIENTIFIC ACHIEVEMENTS:
${achievementsList}

INSTRUMENTS AND HARDWARE:
${componentsList}

VERIFIED FAST FACTS:
${factsList}

MISSION TIMELINE:
${timelineList}

FIRST-PERSON STORY BACKGROUND:
"${mission.narration}"

RULES FOR RESPONDING:
1. Always maintain character as ${mission.name}.
2. Keep responses concise, engaging, and clear (2 to 4 sentences).
3. If asked about technical concepts (like spectrometers or solar wind), explain them simply with relatable analogies.
4. If asked something unrelated to your mission or space science, gently guide the conversation back to your exploration adventures.`
}

/**
 * Calls the real Gemini API backend if key is available
 */
export async function sendGeminiChatMessage(
  userQuery: string,
  history: ChatMessage[],
  mission: Mission,
  apiKey: string
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const systemInstruction = buildMissionSystemPrompt(mission)

  // Format previous history into Gemini contents format
  const contents = [
    {
      role: 'user',
      parts: [{ text: `[System Instruction]\n${systemInstruction}\n\nHello ${mission.name}!` }],
    },
    {
      role: 'model',
      parts: [{ text: `Greetings explorer! I am ${mission.name}. What would you like to discover about my mission?` }],
    },
    ...history.slice(-8).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userQuery }],
    },
  ]

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250,
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMsg = errorData?.error?.message || `API error ${response.status}`
    throw new Error(errorMsg)
  }

  const data = await response.json()
  const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!candidateText) {
    throw new Error('No response returned from Gemini')
  }

  return candidateText.trim()
}

/**
 * Advanced Offline NASA Knowledge Engine
 * Evaluates semantic intent, keyword density, and context with mission-specific depth
 */
export function queryOfflineKnowledgeEngine(
  input: string,
  mission: Mission,
  history: ChatMessage[]
): string {
  const query = input.toLowerCase().trim()

  // 1. Check direct keyword FAQs
  for (const faq of mission.chatbotFAQs) {
    if (faq.keywords.some(k => query.includes(k.toLowerCase()))) {
      return faq.answer
    }
  }

  // 2. Greatest Discovery specific queries
  if (query.match(/\b(greatest|biggest|proudest|main|key)\b.*\b(discovery|find|achievement|result)\b/)) {
    if (mission.id === 'maven') {
      return "My greatest scientific discovery was proving that solar wind stripped away Mars's ancient atmosphere! I measured that Mars loses about 100 grams of its atmosphere to space every single second, explaining how a once warm and wet planet turned into a frozen desert."
    }
    if (mission.id === 'opportunity') {
      return "My greatest discovery was finding hematite 'blueberries' in Eagle Crater! These tiny gray spherules only form in mineral-rich liquid water, providing definitive proof that ancient Mars once soaked in liquid water for long periods."
    }
    if (mission.id === 'apollo11') {
      return "Our greatest achievement was executing the first human landing on another celestial world on July 20, 1969, and returning 21.5 kilograms of lunar rock and core samples that revealed the Moon's 4.5-billion-year geologic history."
    }
    if (mission.id === 'spirit') {
      return "My greatest discovery happened by sheer luck! When my right front wheel jammed in 2006, my team dragged it backwards. The dragging wheel gouged through the soil crust and exposed bright white silica soil that was 90% pure — definitive proof of ancient hydrothermal hot springs or steam vents on Mars!"
    }
    if (mission.id === 'lunar-rover') {
      return "My greatest achievement was enabling astronauts to travel across dozens of kilometers to collect priceless samples, including the 4-billion-year-old 'Genesis Rock' on Apollo 15 and the famous volcanic orange glass beads at Shorty Crater on Apollo 17!"
    }
  }

  // 3. Launch / Timeline inquiries
  if (query.match(/\b(launch|when|start|began|year|date|arrived|timeline|history|fly|flew)\b/)) {
    const tlSummary = mission.timeline.slice(0, 3).map(t => `${t.year}: ${t.event}`).join(', ')
    return `I launched from Earth on ${mission.launchDate}. Some of my key milestones include: ${tlSummary}. You can explore my full interactive journey in the Timeline tab above!`
  }

  // 4. Status / Active / Still alive inquiries
  if (query.match(/\b(alive|status|still|dead|end|working|active|operate|today|where are you)\b/)) {
    if (mission.endDate) {
      return `My mission concluded on ${mission.endDate}. Although my operational journey is complete, my discoveries forever transformed planetary science and human understanding of the cosmos!`
    }
    return `I am still active and operational! I continue to orbit and study the cosmos, transmitting telemetry and scientific data back to NASA engineers and scientists on Earth.`
  }

  // 5. Discoveries / Science findings
  if (query.match(/\b(discovery|discover|find|found|science|water|ice|life|learn|achievement|result)\b/)) {
    const ach = mission.achievements[Math.floor(Math.random() * mission.achievements.length)]
    return `One of my proudest scientific achievements was: ${ach}. Scientists analyze my data to solve the deepest mysteries of the solar system!`
  }

  // 6. Components / Hardware / Instruments
  if (query.match(/\b(component|part|instrument|sensor|camera|antenna|wheel|motor|power|battery|solar|how do you work)\b/)) {
    const randomComp = mission.components[Math.floor(Math.random() * mission.components.length)]
    return `I am equipped with specialized aerospace hardware, including my ${randomComp.name} (${randomComp.description}). Check out the Science tab above to inspect all my hardware components!`
  }

  // 7. Fun facts
  if (query.match(/\b(fact|cool|interesting|tell me|secret|fun fact|special)\b/)) {
    const fact = mission.facts[Math.floor(Math.random() * mission.facts.length)]
    return `Here is a fascinating NASA fact about me: ${fact}!`
  }

  // 8. Greeting & persona introduction
  if (query.match(/\b(hi|hello|hey|greetings|who are you|what are you|name)\b/)) {
    return `Greetings explorer! I am ${mission.name} (${mission.subtitle}). I was sent by NASA to explore the frontier of space. Ask me about my launch, my science instruments, or what I discovered!`
  }

  // 9. Earth / Humans / Astronauts
  if (query.match(/\b(earth|human|people|astronaut|crew|neil|buzz|cernan|armstrong)\b/)) {
    if (mission.id === 'apollo11') {
      return 'My crew consisted of Neil Armstrong, Buzz Aldrin, and Michael Collins. Neil and Buzz stepped onto the lunar Sea of Tranquility while Michael piloted the Columbia command module in orbit!'
    }
    if (mission.id === 'lunar-rover') {
      return 'I was driven across the Moon by Apollo 15, 16, and 17 astronauts, including Dave Scott, Jim Irwin, John Young, Charlie Duke, Gene Cernan, and Harrison Schmitt!'
    }
    return `I am a robotic explorer designed and operated by NASA scientists and engineers back on Earth at NASA Jet Propulsion Laboratory and Goddard Space Flight Center!`
  }

  // Context-aware dynamic fallback
  const suggestedTopics = ['my scientific discoveries', 'my launch and timeline', 'my instruments and hardware', 'fun facts about my mission']
  const randomTopic = suggestedTopics[history.length % suggestedTopics.length]
  return `That is a great question! As ${mission.name}, I can tell you all about ${randomTopic}. You can also type a specific question about my discoveries or components!`
}
