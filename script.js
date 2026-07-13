// Lista de espera: grava no Supabase (schema personais, tabela waitlist).
// A anon key é pública por design; a RLS só permite INSERT com e-mail válido.
const SUPABASE_URL = "https://nbqiuluvterxznzzoxlk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xV4_-RAWQ_K2n_f2g2v8Ow_LvYFe-jk";

const form = document.getElementById("form-espera");
const mensagem = document.getElementById("mensagem-espera");

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const dados = new FormData(form);
  const email = String(dados.get("email") ?? "").trim();
  const roleInterest = String(dados.get("role_interest") ?? "student");

  // honeypot: bots preenchem o campo invisível
  if (dados.get("site")) return;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    mostrarMensagem("Digite um e-mail válido.", "erro");
    return;
  }

  const botao = form.querySelector("button[type=submit]");
  botao.disabled = true;
  mostrarMensagem("Enviando...", "ok");

  try {
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "content-type": "application/json",
        "content-profile": "personais",
        prefer: "return=minimal"
      },
      body: JSON.stringify({ email, role_interest: roleInterest })
    });

    if (resposta.status === 409) {
      mostrarMensagem("Este e-mail já está na lista. Até breve!", "ok");
    } else if (resposta.ok) {
      mostrarMensagem("Pronto! Você será avisado no lançamento.", "ok");
      form.reset();
    } else {
      mostrarMensagem("Não foi possível salvar agora. Tente de novo em instantes.", "erro");
    }
  } catch {
    mostrarMensagem("Sem conexão. Verifique sua internet e tente de novo.", "erro");
  } finally {
    botao.disabled = false;
  }
});
