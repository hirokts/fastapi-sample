'use server';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  // try {
  //   await signIn('credentials', formData);
  // } catch (error) {
  //   if (error instanceof AuthError) {
  //     switch (error.type) {
  //       case 'CredentialsSignin':
  //         return 'Invalid credentials.';
  //       default:
  //         return 'Something went wrong.';
  //     }
  //   }
  //   throw error;
  // }
  console.log(`prevState: ${prevState} formData: ${formData}`);
  return "dummy"
}
