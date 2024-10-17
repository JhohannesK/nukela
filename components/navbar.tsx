'use client';
import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { ModeToggle } from './theme-toggle-btn';

const Navbar = () => {
	return (
		<div className='fixed flex w-full z-50 justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary'>
			<div className='flex items-center'>
				<Menu className='block md:hidden' />
				<Link href={'/'}>
					<h1
						className={cn(
							'hidden md:block text-xl md:text-2xl font-bold text-primary'
						)}
					>
						Nukela
					</h1>
				</Link>
			</div>
			<div className='flex items-center gap-3'>
				<p>Home</p>
				<Link href={'/figure/new'}>Create</Link>
				<p>Settings</p>
			</div>
			<div className='flex items-center gap-x-3'>
				<Button className=' text-white' size={'sm'} variant={'premium'}>
					Upgrade
					<Sparkles className='ml-2  h-4 w-4 fill-white text-white' />
				</Button>
				<ModeToggle />
				<UserButton />
			</div>
		</div>
	);
};

export default Navbar;
