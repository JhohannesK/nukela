'use client';
import { Figure, Message, Role } from '@prisma/client';
import React, { FormEvent, useState } from 'react';
import ChatHeader from './chat-header';
import { useRouter } from 'next/navigation';
import { useCompletion } from 'ai/react';
import ChatForm from './chat-form';
import ChatMessages from './chat-messages';

const ChatComp = ({
	figure,
}: {
	figure: Figure & {
		Message: Message[];
		_count: {
			Message: number;
		};
	};
}) => {
	const router = useRouter();
	const [messages, setMessages] = useState<
		{
			role: Role;
			content?: string;
			isLoading?: boolean;
			src?: string;
		}[]
	>(figure.Message);
	const { input, isLoading, handleInputChange, handleSubmit, setInput } =
		useCompletion({
			api: `/api/chat/${figure.id}`,
			onFinish(prompt, completion) {
				const figureAIMessage = {
					role: Role.figureAI,
					content: completion,
				};

				setMessages((current) => [...current, figureAIMessage]);
				setInput('');

				router.refresh();
			},
		});

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		const userMessage = {
			role: Role.user,
			content: input,
		};

		setMessages((current) => [...current, userMessage]);

		handleSubmit(e);
	};

	return (
		<div className='flex flex-col h-full p-4 justify-between space-y-2'>
			<ChatHeader figure={figure} />
			<ChatMessages
				figure={figure}
				isLoading={isLoading}
				messages={messages}
			/>
			<ChatForm
				isLoading={isLoading}
				input={input}
				handleInputChange={handleInputChange}
				onSubmit={onSubmit}
			/>
		</div>
	);
};

export default ChatComp;
