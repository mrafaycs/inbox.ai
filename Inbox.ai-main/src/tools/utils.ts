import { getGmailClient } from "../lib/gmail";

export const latestMail = async () => {
  const gmail = getGmailClient();
  const listRes = await gmail.users.messages.list({
    userId: "me",
    maxResults: 1, 
  });

  const messages = listRes.data.messages;
  if (!messages || messages.length === 0) {
    console.log("No messages found.");
    return null;
  }

  const latestMessageId = messages[0].id;
  const msgRes = await gmail.users.messages.get({
    userId: "me",
    id: latestMessageId!,
    format: "full",
  });

  const payload = msgRes.data.payload;
  const headers = payload?.headers;

  const subject = headers?.find(h => h.name === "Subject")?.value || "(No Subject)";
  const from = headers?.find(h => h.name === "From")?.value || "(Unknown Sender)";
  const snippet = msgRes.data.snippet || "";

  return {
    subject,
    from,
    snippet,
    id: latestMessageId,
  };
};

export const sent_mail=async(to:string[],message:string,subject:string):Promise<string>=>{
  const gmail = getGmailClient();

  const rawMessage=[
    `To: ${to.join(',')}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    message,
  ].join('\n');

  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  return `Mail sent successfully `;
};

export const get_mail = async (from_date: Date, to_date: Date): Promise<string[]> => {
  const gmail = getGmailClient();

  const after = Math.floor(from_date.getTime() / 1000);
  const before = Math.floor(to_date.getTime() / 1000);

  const res = await gmail.users.messages.list({
    userId: "me",
    q: `after:${after} before:${before}`,
  });

  const messages = res.data.messages || [];
  const mes_text: string[] = [];

  for (const msg of messages) {
    if (!msg.id) continue;
  
    const fullMsg = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });
  
    const snippet = fullMsg.data.snippet || "(No snippet)";
    mes_text.push(snippet);
  }

  return mes_text;
};

export const get_mail_address = async (keyword: string): Promise<string[]> => {
  const gmail = getGmailClient();

  const res = await gmail.users.messages.list({
    userId: "me",
    q: `${keyword}`,
  });

  const messages = res.data.messages || [];
  const emailAddresses: string[] = [];

  for (const msg of messages) {
    if (!msg.id) continue;

    const fullMsg = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });

    const headers = fullMsg.data.payload?.headers || [];

    const fromHeader = headers.find(h => h.name.toLowerCase() === "from");
    if (fromHeader && fromHeader.value) {
      const match = fromHeader.value.match(/<(.+)>/);
      const email = match ? match[1] : fromHeader.value;
      emailAddresses.push(email);
    }
  }

  return emailAddresses;
};

export const list_label=async():Promise<string[]>=>{
  const gmail=getGmailClient();
  const res=await gmail.users.labels.list({
    userId:"me"
  })
  const labels=res.data.labels||[];
  return labels.map(label=>label.name||"Unnamed Label");
}

export const create_label=async(name:string):Promise<string>=>{
  const gmail=getGmailClient()
  try{
    const res=gmail.users.labels.create({
      userId:"me",
      requestBody:{
        name:name,
        labelListVisibility:"labelShow",
        messageListVisibility:"show",
      }
    })
  
    return "Label Created Successfully";
  }
  catch(err){
    return  `Failed: ${err} `
  }
  
}