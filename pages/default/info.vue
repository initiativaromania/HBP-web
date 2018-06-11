<template>
  <b-container fluid>
    <h1 class="mt-3"> Info </h1>
    <p> <b>Inițiativa România</b> consideră că cetățenii au dreptul să beneficieze de informații de interes public, în mod gratuit, în timp real, 
      într-un format accesibil, lesne de ințeles și de utilizat, prelucrabil, care să permită cetățenilor să aibă o cunoaștere corectă și să 
      poată participa la luarea de decizii informate în interesul comunității din care fac parte.
    </p>

    <p>
      <a href="/"><b>Harta Banilor Publici (HBP)</b></a> a pornit din nevoia de a oferi utilizatorilor o interfață cât mai prietenoasă către 
      achizițiile publice din România. Pană acum, pentru a analiza contractele publice ale unei instituții/companii, trebuiau parcurse fișiere
       mari în format CSV. Prin <a href="/"><b>HBP</b></a> ne orientăm mai mult către cetățenii obișnuiți, dar le ușurăm munca și celor care 
       sunt experimentați în domeniu. Aceste rapoarte mari de pe data.gov.ro, fisierele in format CSV, au fost parcurse, corectate și transpuse 
       într-o baza de date relațională, care acum însumează 
       {{ parseInt(stats.general.institutions, 10).toLocaleString() }} de insituții publice, 
       {{ parseInt(stats.general.companies, 10).toLocaleString() }} de companii, 
       {{ parseInt(stats.general.contracts, 10).toLocaleString() }} de achiziții directe și 
       {{ parseInt(stats.general.tenders, 10).toLocaleString() }} de licitații
        din ultimii 10 ani din întreaga țară.
    </p>

    <hr class="solid"/>
    <p>
      Aplicaţia poate fi accesată prin:
      <ul>
        <li>o interfață web;</li>
        <li>aplicații mobile Android şi iOS.</li>
      </ul>

      <a href="https://itunes.apple.com/us/app/harta-banilor-publici/id1396034488" class="m-2" ><img src="/appstore.png" alt="Descarcă din Apple AppStore"></a>
      <a href="https://play.google.com/store/apps/details?id=initiativaromania.hartabanilorpublici" target="_blank" class="m-2" ><img src="/google-play.png" alt="Descarcă din Google Play"></a>
    </p>

    <hr class="solid" />

    <p>
      <a href="/"><b>Harta Banilor Publici</b></a> vă permite să faceti propriiile voastre analize la nivel național privind cheltuirea banului public. Listează 
      toate instituțiile publice din țară pe o hartă Google si permite accesarea tuturor contractelor pentru fiecare instituție. De asemenea, 
      prin aplicație puteți să cautați companii, contracte sau instituții dupa nume și să listați topuri și statistici relevante:
      <ul>
        <li>evoluţia numărului de contracte de achiziţii publice (licitaţii + achiziţii directe) per instituţie/companie;</li>
        <li>evoluţia valorii în RON a contractelor de achiziţie publică (licitaţii + achiziţii directe) per instituţie/companie</li>
        <li>posibilitatea de a filtra în funcţie de data achiziţiei publice (licitaţii+achiziţii directe), statistici legate de CPV.</li>
      </ul>
    </p>
    
    <p>
      Utilitatea aplicației este evidentă. Informaţiile şi a analizele pe care le pot face utilizatorii pot fi folosite în diverse proiecte 
      civice locale şi în investigaţii jurnalistice. 
      <a href="/"><b>HBP</b></a> se doreşte a fi un punct de pornire pentru un dialog susţinut şi informat cu 
      instituţiile publice locale şi/sau naţionale, privind oportunitatea cheltuirii fondurilor publice sau pentru crearea bugetelor 
      participative la nivel local.
    </p>

    <hr class="solid" />

    <p>
      <a href="/"><b>Harta Banilor Publici</b></a> este un proiect open-source, executat doar în regim de voluntariat, cu un buget de 
      proiect minuscul (doar 2000 EUR reprezentând un premiu, câştigat în 2017, într-o competiţie internaţională de proiecte civice). 
      <a href="/"><b>HBP</b></a> poate fi scalată și pentru alte ţări.
    </p>

    <p>Varianta demo a aplicatiei a fost premiată atat la nivel național cât si internațional de către:
      <ul>
        <li>Guvernul României în 2016, în cadrul unui concurs organizat de Parteneriatului pentru Guvernare Deschisă (OGP Romania)
          </li>
        <li>Mobile Awards Romania (2016)</li>
        <li>Transparency Camp Europe (iunie 2016)</li>
        <li>Webstock Awards Romania (2016)</li>
        <li>European Resource Bank (aprilie 2017)</li>
      </ul>
    </p>
  </b-container>
</template>

<script>
export default {
  name: 'Info',
  data: function () {
    return {
      stats: {general: {}, companies: {}, institutions: {}}
    }
  },
  async asyncData ({app}) {
    let {data} = await app.$axios.get('stats')
    return { stats: data }
  },
  head () {
    return {
      title: 'Harta banilor publici / Info',
      meta: [
        { hid: 'description', name: 'description', content: 'Harta banilor publici - Info' }
      ]
    }
  }
}
</script>