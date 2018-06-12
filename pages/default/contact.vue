<template>
  <b-container fluid>
    <h1 class="my-3">Contactează-ne</h1>
    <p>
    <a href="/"><b>Harta banilor publici</b></a> este o aplicație open-source. Pe măsură ce primim sugestii sau contribuții de la 
      utilizatorii noștri putem îmbunătăți funcționalitatea aplicației. Dacă aveți întrebări, sau dacă aveți sugestii de îmbunătățire a website-ului
      ne puteți contacta prin următoarele canale de comunicare:
      <ul>
        <li>Email: <a href="mailto:hbp@initiativaromania.ro">hbp@initiativaromania.ro</a></li>
        <li>Facebook: <a href="https://www.facebook.com/initiativaromania2016/" target="_blank">initiativaromania2016</a></li>
      </ul>
    </p>
    <p>
      Codul sursă al aplicației poate fi găsit pe pagina <b>Github</b>: 
      <a href="https://github.com/initiativaromania/" target="_blank">initiativaromania</a>.
    </p>
  </b-container>
</template>

<script>
export default {
  name: 'Contact',
  head () {
    return {
      title: 'Harta banilor publici / Contact',
      meta: [
        { hid: 'description', name: 'description', content: 'Harta banilor publici - Contact' }
      ]
    }
  }
}
</script>