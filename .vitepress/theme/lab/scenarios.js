const rows = [
  {
    id: 'dependency', icon: 'fa-puzzle-piece',
    name: ['A plugin cannot start', 'Un plugin no arranca', 'Un plugin non si avvia', 'Um plugin não inicia'],
    log: '[Server thread/ERROR]: Could not load ExampleShop.jar\njava.lang.NoClassDefFoundError: net/milkbowl/vault/economy/Economy\nCaused by: java.lang.ClassNotFoundException: net.milkbowl.vault.economy.Economy',
    explanation: ['The missing class belongs to Vault’s economy API. This points to a missing or unavailable dependency, rather than a reason to delete the world. The complete startup log is needed to confirm why Vault did not load.', 'La clase ausente pertenece a la API de economía de Vault. Esto apunta a una dependencia que falta o no está disponible. Revisa el log completo de inicio para confirmar por qué Vault no cargó.', 'La classe mancante appartiene all’API economica di Vault. Indica una dipendenza mancante o non disponibile. Controlla il log completo di avvio per confermare perché Vault non si è caricato.', 'A classe ausente pertence à API de economia do Vault. Isso indica uma dependência ausente ou indisponível. Confira o log completo de inicialização para entender por que o Vault não carregou.'],
    steps: [
      ['Check ExampleShop’s declared dependencies and supported server versions.', 'Revisa las dependencias declaradas y las versiones compatibles de ExampleShop.', 'Controlla dipendenze e versioni server supportate da ExampleShop.', 'Confira dependências e versões de servidor compatíveis com ExampleShop.'],
      ['Look earlier in the log for a Vault loading failure. Install or update only the dependency required by your plugin.', 'Busca un fallo de carga de Vault antes de este error. Instala o actualiza la dependencia que requiera tu plugin.', 'Cerca un errore di caricamento di Vault prima di questo messaggio. Installa o aggiorna la dipendenza richiesta.', 'Procure uma falha de carregamento do Vault antes deste erro. Instale ou atualize a dependência exigida.'],
      ['Restart a test server and verify that both plugins enable successfully.', 'Reinicia un servidor de prueba y verifica que ambos plugins se activen correctamente.', 'Riavvia un server di prova e verifica che entrambi i plugin si attivino.', 'Reinicie um servidor de teste e confira se ambos os plugins iniciam corretamente.']
    ], page: 'crash-analysis'
  },
  {
    id: 'tick', icon: 'fa-stopwatch',
    name: ['A frozen main thread', 'El hilo principal se congela', 'Il thread principale si blocca', 'A thread principal trava'],
    log: '[Solver] TickMonitor: no tick for 5200ms\n"Server thread" WAITING\n  at java.util.concurrent.CompletableFuture.join(...)\n  at ExampleEconomy.onPlayerJoin(ExampleEconomy.java:84)',
    explanation: ['The sampled main thread is waiting for a future inside ExampleEconomy’s join handler. This is a lead to investigate, not proof that every freeze has the same cause. Compare multiple thread dumps and the plugin’s version.', 'La muestra del hilo principal está esperando un resultado dentro de ExampleEconomy al entrar un jugador. Es una pista para investigar; compara varias capturas y la versión del plugin antes de concluir la causa.', 'Il thread principale campionato attende un risultato nel gestore di accesso di ExampleEconomy. È una pista: confronta più thread dump e la versione del plugin prima di concludere.', 'A amostra da thread principal aguarda um resultado no evento de entrada do ExampleEconomy. É uma pista: compare várias capturas e a versão do plugin antes de concluir a causa.'],
    steps: [
      ['Save the thread dump and the timestamps of affected player joins.', 'Guarda la captura del hilo y las horas de las conexiones afectadas.', 'Salva il thread dump e gli orari degli accessi coinvolti.', 'Salve a captura da thread e os horários das entradas afetadas.'],
      ['Check the plugin’s database connectivity and known fixes. Reproduce the issue in a test environment.', 'Revisa la conexión a la base de datos y las correcciones del plugin. Reproduce el problema en un entorno de prueba.', 'Controlla connessione al database e correzioni del plugin. Riproduci il problema in un ambiente di prova.', 'Confira a conexão ao banco e as correções do plugin. Reproduza o problema em um ambiente de teste.'],
      ['After applying a verified fix, repeat the same player-join test and compare the results.', 'Tras aplicar una corrección verificada, repite la prueba de conexión y compara los resultados.', 'Dopo una correzione verificata, ripeti il test di accesso e confronta i risultati.', 'Depois de uma correção verificada, repita o teste de entrada e compare os resultados.']
    ], page: 'tick-monitor'
  },
  {
    id: 'moderation', icon: 'fa-comments',
    name: ['Moderation with context', 'Moderación con contexto', 'Moderazione con contesto', 'Moderação com contexto'],
    log: '[14:02:01] <PlayerA> stop messaging me, please\n[14:02:07] <PlayerB> I will keep following you on every server\n[14:02:08] [Solver] action.mode=alert-only\n[14:02:08] [Solver] Incident queued for staff review',
    explanation: ['The repeated contact after a request to stop deserves staff review. In alert-only mode the example produces a notification, not an automatic sanction. Staff should examine the surrounding conversation and the server’s rules.', 'El contacto persistente después de pedir que pare merece una revisión del staff. En este ejemplo, el modo de solo alertas genera una notificación. El staff debe revisar la conversación completa y las reglas del servidor.', 'Il contatto persistente dopo una richiesta di smettere merita una revisione dello staff. Nell’esempio la modalità solo avvisi genera una notifica. Lo staff deve leggere la conversazione completa e le regole.', 'O contato persistente depois de um pedido para parar merece revisão da equipe. Neste exemplo, o modo apenas alertas gera uma notificação. A equipe deve conferir a conversa completa e as regras.'],
    steps: [
      ['Read the incident context and check whether other messages change its meaning.', 'Lee el contexto del incidente y comprueba si otros mensajes cambian su significado.', 'Leggi il contesto e verifica se altri messaggi ne cambiano il significato.', 'Leia o contexto e veja se outras mensagens mudam seu significado.'],
      ['Apply the server’s moderation policy and document the decision.', 'Aplica la política de moderación del servidor y documenta la decisión.', 'Applica la politica di moderazione del server e documenta la decisione.', 'Aplique a política de moderação do servidor e documente a decisão.'],
      ['Review false positives before changing thresholds or enabling automatic actions.', 'Revisa los falsos positivos antes de cambiar umbrales o activar acciones automáticas.', 'Valuta i falsi positivi prima di modificare soglie o attivare azioni automatiche.', 'Revise falsos positivos antes de mudar limites ou ativar ações automáticas.']
    ], page: 'configuration'
  }
]
export function scenariosFor(locale) {
  const i = ['en', 'es', 'it', 'pt'].indexOf(locale)
  return rows.map(r => ({ ...r, name: r.name[i], explanation: r.explanation[i], steps: r.steps.map(s => s[i]) }))
}
