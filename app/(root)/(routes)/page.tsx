import Categories from '@/components/categories';
import FiguresDisplay from '@/components/figures-display';
import SearchInput from '@/components/search-input';
import prismadb from '@/lib/prismadb';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react';

const RootPage = async ({
	searchParams,
}: {
	searchParams: {
		categoryId: string;
		name: string;
	};
}) => {
	const user = await currentUser();
	console.log('🚀 ~ user:', user);
	const data = await prismadb.figure.findMany({
		where: {
			categoryId: searchParams.categoryId,
			name: {
				search: searchParams.name,
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			_count: {
				select: {
					Message: true,
				},
			},
		},
	});

	const categories = await prismadb.category.findMany();
	return (
		<div>
			<SearchInput />
			<Categories data={categories} />
			<FiguresDisplay data={data} />
		</div>
	);
};

export default RootPage;
