<template>
  <b-container fluid>
    <h1 class="my-3 ml-3">Echipa HBP</h1>
    <b-row align-h="around"><b-col cols="12" sm="6" md="4" lg="3" xl="2">
      <b-card img-src="/echipa-elena-ghioc.jpg" img-top style="max-width: 15rem;"
        title="Elena Ghioc" sub-title="Digital Strategist" class="mx-auto">
        <p class="card-text">
          Project manager HBP
        </p>
      </b-card>
    </b-col><b-col cols="12" sm="6" md="4" lg="3" xl="2">
      <b-card img-src="/echipa-claudiu-ghioc.jpg" img-top style="max-width: 15rem;"
        title="Claudiu Ghioc" sub-title="Embedded Software Engineer" class="mx-auto">
        <p class="card-text">
          Dezvoltator al interfeței Android a HBP
        </p>
      </b-card>
    </b-col><b-col cols="12" sm="6" md="4" lg="3" xl="2">
      <b-card img-src="/echipa-george-barbarosie.jpg" img-top style="max-width: 15rem;"
        title="George Barbăroșie" sub-title="Director IT" class="mx-auto">
        <p class="card-text">
          Dezvoltator al interfeței web a HBP
        </p>
      </b-card>
    </b-col><b-col cols="12" sm="6" md="4" lg="3" xl="2">
      <b-card img-src="/echipa-silviu-grijincu.jpg" img-top style="max-width: 15rem;"
        title="Siviu Grijincu" sub-title="Software Engineer" class="mx-auto">
        <p class="card-text">
          Dezvoltator al interfeței iOS a HBP
        </p>
      </b-card>
    </b-col><b-col cols="12" sm="6" md="4" lg="3" xl="2">
      <b-card img-src="/echipa-george-serbanescu.jpg" img-top style="max-width: 15rem;"
        title="George Șerbănescu" sub-title="Software Engineer" class="mx-auto">
        <p class="card-text">
          Dezvoltator web backend HBP
        </p>
      </b-card>
    </b-col><b-col cols="12" sm="6" md="4" lg="3" xl="2">
      <b-card img-src="/echipa-ervin-bolat.jpg" img-top style="max-width: 15rem;"
        title="Ervin Bolat" sub-title="Marketing &amp; UX Specialist" class="mx-auto">
        <p class="card-text">
          Design &amp; visuals HBP
        </p>
      </b-card>
    </b-col><b-col cols="12" sm="6" md="4" lg="3" xl="2">
      <b-card img-src="/echipa-andrei-gologan.jpg" img-top style="max-width: 15rem;"
        title="Andrei Gologan" sub-title="IT Project Manager" class="mx-auto">
        <p class="card-text">
          Specialist date HBP
        </p>
      </b-card>
    </b-col></b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Team',
  head () {
    return {
      title: 'Harta banilor publici / Echipa HBP',
      meta: [
        { hid: 'description', name: 'description', content: 'Harta banilor publici - Echipa HBP' }
      ]
    }
  }
}
</script>