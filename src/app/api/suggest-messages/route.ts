import  OpenAI  from 'openai';
import OpenAIStream from 'ai';
import StreamingTextResponse from 'ai'

export const runtime = 'edge';

const openai  = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
})

export async function POST() {
  try {

    //TODO TODO: REMOVE 
    console.log('here in gpt-ai -------------------')


    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
  
    const response = await openai.chat.completions.create({
      model:'gpt-4o-mini',
      max_completion_tokens:10,
      stream:true,
      prompt,
    })
  
    const stream = OpenAIStream(response)
  
    return new StreamingTextResponse(stream)
  } catch (error) {
        if(error instanceof OpenAI.APIError){
            const {name,status,headers,message} = error

            return Response.json({
                name,status,headers,message
            },{status})
        }else{
            console.log(`an unexpected error occured`,error)
            throw error
        }
  }
}