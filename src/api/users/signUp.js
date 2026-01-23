'use server';

export async function signUp(userData) {
  try {
    const response = await fetch(`${process.env.SERVER_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) return response.status || 400;

    return 201;
  } catch (err) {
    return 500;
  }
}
