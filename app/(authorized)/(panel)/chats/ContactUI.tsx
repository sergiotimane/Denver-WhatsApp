import Link from 'next/link';
import { ContactFE } from '@/types/contact';
import BlankUser from './BlankUser';
import { UPDATE_CURRENT_CONTACT, useCurrentContact, useCurrentContactDispatch } from './CurrentContactContext';
import { cn } from '@/lib/utils';
import { DBTables } from '@/lib/enums/Tables';
import { createClient } from '@/utils/supabase-browser';

import { useSetContactTab } from '../layoutClient';

export default function ContactUI(props: { contact: ContactFE }) {
	const setCurrentUser = useSetContactTab();

	const { contact } = props;
	const currentContact = useCurrentContact();
	const setCurrentContact = useCurrentContactDispatch();

	const supabase = createClient();

	const handleClick = async () => {
		setCurrentUser(false);

		// Update local state
		setCurrentContact && setCurrentContact({ type: UPDATE_CURRENT_CONTACT, contact: { ...contact, unread_count: 0 } });

		// Update Supabase
		const { error } = await supabase.from(DBTables.Contacts).update({ unread_count: 0 }).eq('wa_id', contact.wa_id);

		if (error) {
			console.error('Error updating unread_count:', error);
		}
	};

	return (
		<Link href={`/chats/${contact.wa_id}`} onClick={handleClick}>
			<div className={cn('flex flex-row p-2 hover:bg-background-default-hover gap-2 cursor-pointer ', currentContact && currentContact.current?.wa_id === contact.wa_id ? 'bg-background-default-hover' : '')}>
				<div>
					<BlankUser className='w-12 h-12' />
				</div>
				<div className='flex flex-row justify-between items-center w-full px-2'>
					<div className='flex items-center gap-'>
						<div className='flex flex-col'>
							<div>{contact.profile_name}</div>
							<div className='text-sm'>+{contact.wa_id}</div>
						</div>
					</div>
					<div className='flex flex-col items-end'>
						{(() => {
							if (contact.unread_count && contact.unread_count > 0) {
								return <div className='bg-green-500 flex-grow-0 flex-shrink-0 p-2 h-6 w-6 text-white rounded-full text-xs font-bold flex items-center justify-center'>{contact.unread_count}</div>;
							}
						})()}
						<div>
							<span className='text-xs text-gray-500'>{contact.timeSince}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
