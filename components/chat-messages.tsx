import { Figure, Role } from '@prisma/client';
import React from 'react';
import ChatMessage from './chat-message-role';

const ChatMessages = ({
	figure,
	isLoading,
	messages,
}: {
	figure: Figure;
	isLoading: boolean;
	messages: {
		role: Role;
		content?: string;
		isLoading?: boolean;
		src?: string;
	}[];
}) => {
	return (
		<div className='flex-1 overflow-y-auto pr-4'>
			<ChatMessage
				role={Role.figureAI}
				content={`Hello, I am ${figure.name}, ${figure.description}`}
				isLoading={isLoading}
			/>
			{messages.map((message, index) => (
				<ChatMessage
					role={message.role}
					key={index}
					content={message.content}
					src={message.src}
				/>
			))}
			{isLoading && (
				<ChatMessage
					role={Role.figureAI}
					src={figure.src ?? ''}
					isLoading
				/>
			)}
		</div>
	);
};

export default ChatMessages;
