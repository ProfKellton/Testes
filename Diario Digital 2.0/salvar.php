<?php
$dados = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli("localhost", "root", "", "anotacoes");

if ($conn->connect_error) {
  http_response_code(500);
  echo "Erro de conexão.";
  exit;
}

$stmt = $conn->prepare("INSERT INTO usuarios (email, senha, data, anotacao) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $dados["email"], $dados["senha"], $dados["data"], $dados["anotacao"]);

if ($stmt->execute()) {
  echo "Anotação salva com sucesso!";
} else {
  echo "Erro ao salvar anotação.";
}

$stmt->close();
$conn->close();
?>
