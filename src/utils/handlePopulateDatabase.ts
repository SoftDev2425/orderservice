import prisma from '../../prisma/client';

export const handlePopulateDatabase = async () => {
  const usersData = [
    {
      name: 'Andreas',
      email: 'af@af.dk',
      password: 'password',
    },
    {
      name: 'Owais',
      email: 'ow@ow.dk',
      password: 'password',
    },
  ];

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { email: userData.email }, // Match on email to check existence
      update: {}, // If a match is found, do nothing
      create: userData, // If no match is found, create the new entry
    });
  }
};
