const API_URL = "http://localhost:8080/api/reservas";

export async function crearReserva(data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error al enviar la reserva:", error);
    throw error;
  }
}
