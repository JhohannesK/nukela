'use client';
import { Category } from '@prisma/client';
import React from 'react';
import { Button } from './ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { cn } from '@/lib/utils';

const Categories = ({ data }: { data: Category[] }) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const categoryId = searchParams.get('categoryId');

	const onClick = (id: string | undefined) => {
		const query = { categoryId: id };

		const url = qs.stringifyUrl(
			{
				url: window.location.href,
				query,
			},
			{ skipNull: true }
		);

		router.push(url);
	};
	return (
		<div className='w-full overflow-x-auto space-x-2 flexx p-1'>
			<Button
				className={cn(
					` text-white hover:text-black`,
					!categoryId ? 'bg-primary/25' : 'bg-primary/10'
				)}
			>
				Newest
			</Button>
			{data.map((item) => (
				<Button
					key={item.id}
					className={cn(
						` text-white hover:text-black`,
						item.id === categoryId ? 'bg-primary/25' : 'bg-primary/10'
					)}
					onClick={() => onClick(item.id)}
				>
					{item.name}
				</Button>
			))}
		</div>
	);
};

export default Categories;
