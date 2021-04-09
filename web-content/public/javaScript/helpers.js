async function delBrand(id) {
  try {
    await fetch(`http://localhost:3003/api-brands/brand/${id.trim()}`, {
      method: 'DELETE',
    });
    location.href = '/brands';
  } catch (error) {
    throw error;
  }
}
