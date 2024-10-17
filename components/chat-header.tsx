'use client';
import { Figure, Message } from '@prisma/client';
import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BotAvatar from './bot-avatar';

const ChatHeader = ({
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
	return (
		<div className='flex w-full justify-between items-center border-b border-primary/10 pb-4'>
			<div className='flex gap-x-2 items-center'>
				<Button
					onClick={() => router.back()}
					size={'icon'}
					variant={'ghost'}
				>
					<ChevronLeft className='h-8 w-8' />
				</Button>
				<BotAvatar src={figure.src ?? ''} />
				<div className='flex flex-col items-center gap-y-1'>
					<div>
						<p>{figure.name}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatHeader;
