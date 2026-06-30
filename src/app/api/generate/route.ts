import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contentType, topic, tone, wordLimit = 200 } = body;

    if (!contentType || !topic || !tone) {
      return NextResponse.json(
        { error: "Content Type, Topic, and Tone are required fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && apiKey.trim().length > 0) {
      // Live integration with Groq API - OpenAI compatible
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile", // Standard high-quality Groq model
            messages: [
              {
                role: "system",
                content: `You are an expert AI copywriting assistant. Respond ONLY with the requested content. Do NOT include any conversational intro, outline headers, wrapper notes, or outro lines. Just write the copy directly.`
              },
              {
                role: "user",
                content: `Write a high-quality ${contentType} about the topic: "${topic}". Use a ${tone} tone of voice. Write approximately ${wordLimit} words. Output in clean markdown format if applicable.`
              }
            ],
            temperature: 0.7,
            max_tokens: Math.min(2048, wordLimit * 4), // Safety limit estimation
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error("Groq API response error:", errData);
          throw new Error(errData.error?.message || "Failed request to Groq API");
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
          throw new Error("Groq API returned empty choice content");
        }

        return NextResponse.json({ content, source: "Groq AI API" });
      } catch (apiError: any) {
        console.warn("Groq API call failed, falling back to local Mock engine. Error:", apiError.message);
        // Fallback to mock on API failure so the user experience doesn't break
      }
    }

    // High-quality fallback Mock AI content generator (no keys required)
    const mockContent = getMockAIResponse(contentType, topic, tone, wordLimit);
    
    // Simulate a slight network delay for natural feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      content: mockContent,
      source: "Offline AI Engine (Simulation)",
    });
  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during content generation" },
      { status: 500 }
    );
  }
}

// Custom parameter-aware mock content generator
function getMockAIResponse(contentType: string, topic: string, tone: string, wordLimit: number): string {
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  
  if (contentType.toLowerCase().includes("blog")) {
    return `## Mastering the Dynamics of ${capitalizedTopic}

In today's rapidly changing world, understanding the core values of **${topic}** has transitioned from a competitive advantage to an absolute operational necessity. When we look at this through a **${tone.toLowerCase()}** lens, it becomes clear that how we integrate these principles directly determines our long-term trajectory.

### Key Aspects of ${capitalizedTopic}

1. **Strategic Implementation**: Successfully leveraging ${topic} starts with an honest audit of current methodologies.
2. **Consistency Over Speed**: The compounding benefits of these concepts are only realized through steady, disciplined application.
3. **Continuous Iteration**: As technical tools and expectations evolve, your approach to ${topic} must pivot accordingly.

### Concluding Recommendations

To achieve the best results, it is imperative to remain active, open-minded, and feedback-driven. By committing to standardizing these ${tone.toLowerCase()} guidelines, you lay the foundation for sustainable success. Start small, track your benchmarks, and watch your capabilities grow.`;
  }
  
  if (contentType.toLowerCase().includes("social") || contentType.toLowerCase().includes("caption")) {
    return `🚀 Thinking about **${capitalizedTopic}** lately? 

It's easy to get lost in the noise, but keeping a **${tone.toLowerCase()}** focus can help you cut through the clutter and drive real impact. 

Here are my top 3 rules for optimizing ${topic}:
1️⃣ Start with the end user in mind.
2️⃣ Measure metrics that actually matter.
3️⃣ Don't be afraid to experiment!

What has been your experience with ${topic} so far? Drop your comments below! 👇

#${topic.replace(/\s+/g, '')} #productivity #growthmindset #innovation #${tone.toLowerCase()}`;
  }
  
  if (contentType.toLowerCase().includes("email")) {
    return `Subject: Rethinking our approach to ${topic}

Hi Team,

I hope you're having a productive week. 

I've been reviewing our current strategies surrounding **${topic}** and wanted to propose a few immediate optimizations. By looking at this from a more **${tone.toLowerCase()}** perspective, I believe we can streamline our workflow and drive better outcomes.

Here is what we should focus on first:
* **Process Alignment**: Reviewing where ${topic} fits in our primary funnel.
* **Metric Auditing**: Ensuring our performance indicators reflect our long-term goals.
* **Tool Optimization**: Levering modern utilities to automate repetitive tasks.

Let me know your thoughts on this. I'd love to set aside 15 minutes this Friday to sync on how we can implement this efficiently.

Best regards,

[Your Name]
Content Operations Manager`;
  }
  
  if (contentType.toLowerCase().includes("ad") || contentType.toLowerCase().includes("copy")) {
    return `🔥 **Ready to revolutionize your ${topic} workflow?** 🔥

Meet the industry-leading solution designed specifically to optimize your approach to **${topic}**. 

Whether you're looking to scale your operations, reduce overhead, or simply achieve a more **${tone.toLowerCase()}** output, our framework is built to deliver.

✨ **Why Choose Us?**
* Tailored integration strategies.
* Automated tracking and quality checks.
* 24/7 technical support.

👉 **Click below to book a free demo and claim your 20% discount today!**`;
  }

  // General fallback
  return `### Creative Copy: ${capitalizedTopic}

Writing about **${topic}** with a **${tone.toLowerCase()}** tone of voice presents a unique set of opportunities and challenges. At its core, the goal is to communicate the value of ${topic} clearly and concisely to our target audience.

By focusing on clarity, modern formatting, and user benefits, we can construct a narrative that resonates deeply and inspires actionable interest. Use these concepts to start framing your drafts, ensuring that every sentence adds direct value to the reader.`;
}
