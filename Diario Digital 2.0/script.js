document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const dados = {
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value,
    data: document.getElementById('data').value,
    anotacao: document.getElementById('anotacao').value
  };

  fetch('salvar.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(res => res.text())
  .then(alert)
  .catch(err => alert("Erro: " + err));
});
