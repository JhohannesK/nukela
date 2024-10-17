import { Figure } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import { Card, CardFooter, CardHeader } from './ui/card';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { MessageSquare } from 'lucide-react';

const FiguresDisplay = ({
	data,
}: {
	data: (Figure & {
		_count: {
			Message: number;
		};
	})[];
}) => {
	if (data.length === 0) {
		return (
			<div className='pt-10 flex flex-col items-center justify-center'>
				<div className='relative w-60 h-60'>
					<Image
						fill
						className='grayscale'
						alt='image to show data is empty'
						src={'/empty.svg'}
					/>
				</div>
				<p className='text-3xl font-bold'>Nothing to show</p>
			</div>
		);
	}
	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6'>
			{data.map((item) => (
				<Card
					key={item.id}
					className='bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0'
				>
					<Link href={`/chat/${item.id}`}>
						<CardHeader className='flex items-center justify-center text-center text-muted-foreground'>
							<div className='relative w-32 h-32'>
								<Image
									src={item.src || ''}
									fill
									className='rounded-xl object-cover'
									alt='figure'
								/>
							</div>
							<p className='font-bold'>{item.name}</p>
							<p className='text-xs'>{item.description}</p>
						</CardHeader>
						<CardFooter className='flex items-center justify-between text-xs text-muted-foreground'>
							<p className='lowercase'>@{item?.userName}</p>
							<div className='flex items-center gap-1'>
								<MessageSquare className='h-3 w-3' />
								{item._count.Message}
							</div>
						</CardFooter>
					</Link>
				</Card>
			))}
		</div>
	);
};

export default FiguresDisplay;
