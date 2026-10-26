export function motdTemplates(locale = 'en') {
  const language = ['en','es','it','pt'].indexOf(locale)
  const i = language < 0 ? 0 : language
  const welcome = ['A new adventure starts here.', 'Tu próxima aventura empieza aquí.', 'La tua prossima avventura inizia qui.', 'Sua próxima aventura começa aqui.'][i]
  const build = ['Build something extraordinary.', 'Construye algo extraordinario.', 'Costruisci qualcosa di straordinario.', 'Construa algo extraordinário.'][i]
  const worlds = ['Survival <gray>• <aqua>Creative <gray>• <green>Minigames', 'Supervivencia <gray>• <aqua>Creativo <gray>• <green>Minijuegos', 'Sopravvivenza <gray>• <aqua>Creativa <gray>• <green>Minigiochi', 'Sobrevivência <gray>• <aqua>Criativo <gray>• <green>Minijogos'][i]
  return {
    survival: [`<gradient:#55ffff:#a78bfa><bold>FyrxCraft</bold></gradient> <gray>• ${['Survival','Supervivencia','Sopravvivenza','Sobrevivência'][i]}`, `<green>${welcome}`],
    creative: [`<gradient:#ff8fcf:#b49bff><bold>FyrxCraft</bold></gradient> <white>${['Creative','Creativo','Creativa','Criativo'][i]}`, `<aqua>${build}`],
    network: ['<gold><bold>FYRX NETWORK</bold></gold>', `<yellow>${worlds}`]
  }
}
