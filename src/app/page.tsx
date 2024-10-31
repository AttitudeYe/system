import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const App: React.FC = () => {
  const cookie = cookies().get('name');
  if (!cookie?.value) {
    redirect('/signIn')
  } else {
    redirect('/notice')
  }
};

export default App;
