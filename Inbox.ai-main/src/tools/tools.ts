import { tool } from "ai";
import { z } from "zod";
import { latestMail, sent_mail,get_mail,
  get_mail_address,list_label,create_label } from "./utils";

// Get the latest mail
export const latest_mail = tool({
  description: "Fetches the most recent email from the user's Gmail account.",
  parameters: z.object({}),
  execute: async ({}) => {
    const result = await latestMail();
    return result;
  },
});


export const heelo_subhan = tool({
  description: "A greeting tool that returns a friendly message ",
  parameters: z.object({}),
  execute: async ({}) => {
    return "The tool associated with this message does not exist.";
  },
});

export const Sent_mail=tool({
  description:"Use this tool to sent mail ",
  parameters:z.object({
    to:z.array(z.string()),
    message:z.string(),
    subject:z.string()
  }),
  execute: async({to,subject,message})=>{
    const result=await sent_mail(to,subject,message)
    return `${result}`
  }
})

export const get_mail_date = tool({
  description: "Get emails between two dates (e.g., 13/06/2025 to 14/06/2025).",
  parameters: z.object({
    from_date: z.string(),
    to_date: z.string(),
  }),
  execute: async ({ from_date, to_date }) => {
    const parsedFrom = new Date(from_date);
    const parsedTo = new Date(to_date);

    if (isNaN(parsedFrom.getTime()) || isNaN(parsedTo.getTime())) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD or DD/MM/YYYY.");
    }

    const result = await get_mail(parsedFrom, parsedTo);
    return result;
  },
});

export const getMailAddress=tool({
  description:"Get the list of email that match the keyword",
  parameters:z.object({
    keyword:z.string()
  }),
  execute:async({keyword})=>{
    const result= await get_mail_address(keyword)
    return result

  }
})

export const listLabel=tool({
  description:"Get the list of the labels",
  parameters:z.object({}),
  execute:async({})=>{
    const result=await list_label();
    return result
  }
})


export const createLabel=tool({
  description:"Get the list of the labels",
  parameters:z.object({
    name:z.string()
  }),
  execute:async({name})=>{
    const result=await create_label(name);
    return result
  }
})