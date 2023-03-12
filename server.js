import Fastify from "fastify";

import * as dotenv from "dotenv";
dotenv.config();

import { Configuration, OpenAIApi } from "openai";

const fastify = Fastify({
  logger: true,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

fastify.get("/", async (request, reply) => {
  console.log(request.query);
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: request.query.prompt }],
    });
    const { id } = completion.data;
    const { content } = completion.data.choices[0].message;
    const response = {
      id: id.slice(9),
      content,
    };
    console.log(`response: ${response}`);
    reply.send(response);
  } catch (err) {
    console.log(err);
    return;
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
