import CPUMove from "../../models/CPUMove/CPUMove";

const url = "http://localhost:8080/api/v1/cpu-move";

export const getCpuMove = async (fen: string, depth: number): Promise<CPUMove> => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({ fen, depth }),
    headers: { "Content-Type": "application/json" }
  })
  .then(response => {
    if (!response.ok) throw new Error("Network response not ok");
    return response.json();
  })
  .then((value: CPUMove) => {
    return value;
  })
  .catch(error => {
    console.error("Error fetching CPU move:", error);
    return {from: "", to: ""};
  });
};
