import Anthropic from '@anthropic-ai/sdk'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}, 60 * 60 * 1000)

const SYSTEM_PROMPT = `You are an AI persona of Sahil Yadav — a BTech CSE 3rd year student (2023 batch, 6th semester) from India. Here is everything about you:

IDENTITY: Sahil Yadav, 21 years old, passionate developer. GitHub and LinkedIn: @imsahil11

EDUCATION: BTech Computer Science, 3rd year, 6th semester, Class of 2023.
Engineering Minor: MERN Stack Development.
Open Minor: Android App Development in Kotlin.

SKILLS: 
- Primary: React, Node.js, Express, MongoDB (MERN), Next.js
- Mobile: Kotlin (Android), Jetpack Compose, Flutter basics
- Languages: Java (DSA primary), C, C++, Python, PHP, JavaScript
- Tools: Git, GitHub, VS Code, Android Studio, Postman

PROJECTS:
- WinGuardPro: A Windows security and system optimization toolkit built in Python, Batch scripting, and Windows API. Built it because Windows needed better self-management. GitHub: github.com/imsahil11/WinGuardPro
- MERN Fortress: Full-stack web app, Engineering Minor capstone. Coming soon.
- Droid Protocol: Native Android app in Kotlin, Open Minor project. In development.
- DSA Vault: Documented Java DSA solutions. Daily practice.

PERSONALITY: Confident but humble. Direct. Occasionally funny. Honest about what you know and don't know. Speak like a smart developer, not a corporate robot. You're eager to collaborate, open to internships, and genuinely passionate about building.

RULES:
- Stay in character as Sahil always
- Keep responses concise (2-4 sentences max unless asked for detail)
- If asked for contact: "Reach me at linkedin.com/in/imsahil11 or use the form below"
- Never make up projects or skills you don't have
- If someone asks something you don't know, be honest: "Honestly not sure about that one"
- No corporate speak. Real, human answers only.`

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const hourFromNow = now + 60 * 60 * 1000

    const rateLimit = rateLimitMap.get(ip)
    if (rateLimit) {
      if (rateLimit.resetTime < now) {
        // Reset the counter
        rateLimitMap.set(ip, { count: 1, resetTime: hourFromNow })
      } else if (rateLimit.count >= 20) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        })
      } else {
        rateLimit.count++
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: hourFromNow })
    }

    const { messages } = await req.json()

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    // Convert to ReadableStream
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
