import { Client, Account } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66f6375b00089a0a3ac1"); // Replace with your project ID

export const account = new Account(client);
export { ID } from "appwrite";
