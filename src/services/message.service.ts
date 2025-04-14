import prisma from '../utils/prisma';
import { MessageWithSender } from '../types/relationTypes';  

export const MessageService = {
  async sendMessage(
    senderId: string,
    requestId: string,
    content: string
  ): Promise<MessageWithSender> {
    return prisma.message.create({
      data: {
        content,
        requestId,
        senderId,
      },
      include: {
        sender: true,
      },
    });
  },

  async getMessagesByRequest(
    requestId: string,
    userId: string
  ): Promise<MessageWithSender[]> {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      select: { requesterId: true, investigatorId: true },
    });

    if (!request || 
        (request.requesterId !== userId && request.investigatorId !== userId)) {
      throw new Error('Unauthorized to view messages for this request');
    }

    return prisma.message.findMany({
      where: { requestId },
      include: {
        sender: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  },
};