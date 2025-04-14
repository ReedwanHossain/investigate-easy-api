import { Message, Request, Review, Roles, User } from "@prisma/client";

export type UserWithRoles = User & { roles: Roles[] };
export type RequestWithRelations = Request & {
  requester: User;
  investigator: User | null;
  messages: Message[];
  report: Report | null;
  reviews: Review[];
};

export type MessageWithSender = Message & { sender: User };
export type ReportWithInvestigator = Report & { investigator: User };
export type ReviewWithRelations = Review & {
  reviewer: User;
  investigator: User;
  request: Request;
};