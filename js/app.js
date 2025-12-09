// CONFIGURACIÓN DE FIREBASE
var firebaseConfig = {
    apiKey: "AIzaSyCw18NBzArzvoBqiuDCJZpAxATKpNdMQwc",
    authDomain: "agendavue-12267.firebaseapp.com",
    databaseURL: "https://agendavue-12267-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "agendavue-12267",
    storageBucket: "agendavue-12267.firebasestorage.app",
    messagingSenderId: "209293172124",
    appId: "1:209293172124:web:b1cfd4d7e301649915fc59",
    measurementId: "G-8F1N7ZHD7X"
};

var app = firebase.initializeApp(firebaseConfig);
var db = app.database();

new Vue({
  el: '#app',
  
  firebase: {
    contacts: db.ref('contacts')
  },

  data: {
    contacts: [], // Inicializado vacío
    newContact: { name: '', email: '', phone: '' }
  },

  methods: {
    addContact: function () {
      var name = (this.newContact.name || '').trim();
      var email = (this.newContact.email || '').trim();
      var phone = (this.newContact.phone || '').trim();

      if (!name || !email) {
        alert('Nombre y email son obligatorios');
        return;
      }

      db.ref('contacts').push({ name: name, email: email, phone: phone });
      this.newContact = { name: '', email: '', phone: '' };
    },

    removeContact: function (contact) {
      if (!confirm('¿Borrar este contacto?')) return;
      db.ref('contacts').child(contact['.key']).remove();
    },

    updateJsonLd: function () {
      console.log("1. Intentando actualizar JSON-LD..."); // CHIVATO 1

      // Protección: Si contacts no es un array, usamos array vacío
      var lista = this.contacts || [];
      console.log("2. Contactos detectados:", lista.length); // CHIVATO 2

      var graph = lista.map(function (c) {
        return {
          "@type": "Person",
          "name": c.name || '',
          "email": c.email || '',
          "telephone": c.phone || ''
        };
      });

      var jsonld = {
        "@context": "http://schema.org",
        "@graph": graph
      };

      // Buscamos la etiqueta
      var el = document.getElementById('jsonld');
      
      if (el) {
        console.log("3. ¡Etiqueta encontrada! Escribiendo datos..."); // CHIVATO 3
        el.textContent = JSON.stringify(jsonld, null, 2);
        console.log("4. Escritura finalizada."); // CHIVATO 4
      } else {
        console.error("ERROR: No se encuentra la etiqueta con id='jsonld' en el HTML");
      }
    },

    updateMetaTags(title, description, image, url) {
        document.querySelector('meta[property="og:title"]').setAttribute('content', title);
        document.querySelector('meta[property="og:description"]').setAttribute('content', description);
        document.querySelector('meta[property="og:image"]').setAttribute('content', image);
        document.querySelector('meta[property="og:url"]').setAttribute('content', url);

        document.querySelector('meta[name="twitter:title"]').setAttribute('content', title);
        document.querySelector('meta[name="twitter:description"]').setAttribute('content', description);
        document.querySelector('meta[name="twitter:image"]').setAttribute('content', image);
    },

    // Compartir en Facebook
    shareOnFacebook(contact) {
        const title = `Contacto: ${contact.name}`;
        const description = `Email: ${contact.email}, Teléfono: ${contact.phone}`;
        const image = 'img/portfolio/contact.jpg';
        const url = 'https://example.com/agendaVue';

        this.updateMetaTags(title, description, image, url);

        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    },

    // Compartir en Twitter
    shareOnTwitter(contact) {
        const title = `Contacto: ${contact.name}`;
        const description = `Email: ${contact.email}, Teléfono: ${contact.phone}`;
        const image = 'img/portfolio/contact.jpg'; // Reemplaza con URL real
        const url = 'https://example.com/agendaVue';

        this.updateMetaTags(title, description, image, url);

        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  },

  watch: {
    contacts: {
      handler: function (val) {
        console.log("🔥 CAMBIO DETECTADO EN FIREBASE");
        this.updateJsonLd();
      },
      deep: true
    }
  },

  mounted: function () {
    console.log("🚀 App Montada");
    this.updateJsonLd();
  }
});