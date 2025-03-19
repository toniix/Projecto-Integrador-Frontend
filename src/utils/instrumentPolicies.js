// Políticas de uso para cada tipo de instrumento (esto -también- deberíamos cambiarlo más adelante por información traida de la API)
export const productPolicies = {
  timbal: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Limpia la membrana con un paño seco después de cada uso y evita golpear con baquetas inadecuadas.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No uses baquetas demasiado duras para evitar daños en la membrana.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Guarda en una funda acolchada para evitar golpes durante el transporte.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion:
        "Devuelve el instrumento en las mismas condiciones en que fue entregado.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "En caso de daño, informa de inmediato. No intentes reparaciones por cuenta propia.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion:
        "El timbal debe devolverse limpio y sin alteraciones estructurales.",
    },
  ],
  platillos: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Usa baquetas de punta de fieltro y evita tocar con las manos desnudas para prevenir la oxidación.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No golpees con fuerza excesiva ni uses objetos metálicos para tocarlos.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion: "Usa fundas individuales para evitar rayaduras entre ellos.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion: "Reporta cualquier abolladura o daño antes de devolverlos.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "Los platillos dañados por un uso inadecuado serán responsabilidad del usuario.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion: "Se debe devolver sin rajaduras y con su funda protectora.",
    },
  ],
  bateria: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Ajusta la tensión de los parches regularmente y limpia las piezas metálicas con un paño seco.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "Ajusta los pedales a una tensión cómoda y evita golpes innecesarios en la estructura.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Desmonta los tambores y pedales antes de transportarla para mayor seguridad.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion: "No alteres la configuración original sin autorización.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "En caso de rotura de parches o piezas, deberá reponerse con piezas originales.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion:
        "Todos los elementos de la batería deben devolverse sin modificaciones.",
    },
  ],
  sintetizador: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Mantén el equipo alejado del polvo y la humedad; usa protectores para los conectores.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No sobrecargues la memoria del dispositivo con demasiados efectos simultáneamente.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Usa un estuche rígido y evita impactos en la pantalla y los controles.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion:
        "No instales software no autorizado ni modifiques la programación.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "No intentes abrir ni reparar el sintetizador; cualquier fallo debe ser informado.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion:
        "Debe devolverse con el adaptador y cables originales en buen estado.",
    },
  ],
  teclado: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "No presiones las teclas con fuerza excesiva y limpia con un paño seco para evitar la acumulación de suciedad.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "Usa solo adaptadores de corriente compatibles para evitar daños eléctricos.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Transporta siempre en un estuche acolchado y evita la exposición prolongada al sol.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion:
        "No dejes conectado el adaptador de corriente cuando no esté en uso.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "No intentes abrir el teclado; reporta cualquier mal funcionamiento.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion:
        "Debe devolverse con el cable de alimentación y sin teclas dañadas.",
    },
  ],
  marimba: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Usa mazos adecuados y evita la exposición prolongada al sol o la humedad.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No golpees con baquetas de madera dura, ya que pueden dañar las láminas.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Mantén en un lugar seco y cubre con una funda cuando no esté en uso.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion: "No prestes el instrumento a terceros sin permiso.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "Las láminas dañadas deberán ser reemplazadas con materiales de calidad equivalente.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion: "Debe devolverse con sus mazos originales y sin fisuras.",
    },
  ],
  maracas: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Limpia con un paño seco y evita el contacto con la humedad para prevenir deformaciones.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No golpees las maracas contra superficies duras para evitar que se agrieten.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Guarda en una bolsa acolchada para evitar golpes y cambios de temperatura.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion:
        "Utiliza las maracas con cuidado y evita caídas accidentales.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "Si una maraca se rompe, deberá ser reemplazada por una de características similares.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion:
        "Las maracas deben devolverse sin fisuras ni grietas visibles.",
    },
  ],
  guitarra_electrica: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Limpia el cuerpo con un paño de microfibra y cambia las cuerdas periódicamente.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No uses púas extremadamente duras que puedan dañar el diapasón.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Guarda en un estuche rígido para evitar golpes y daños en el clavijero.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion:
        "No alteres la electrónica interna ni realices modificaciones sin autorización.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "Cualquier falla en el sistema eléctrico debe ser reportada de inmediato.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion:
        "Debe devolverse con sus cables y correa original sin rayaduras graves.",
    },
  ],
  guitarra_acustica: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Limpia las cuerdas después de cada uso y evita golpes en la caja de resonancia.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No expongas la guitarra a cambios bruscos de temperatura que puedan deformar la madera.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Guarda en una funda acolchada para protegerla de golpes y humedad.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion:
        "Evita tocar con anillos u objetos que puedan rayar el acabado.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "Las roturas en el mástil o el cuerpo deberán ser evaluadas para su reposición.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion: "Debe devolverse con el puente y clavijas en buen estado.",
    },
  ],
  viola: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Limpia la resina del arco regularmente y mantén la viola en un ambiente seco.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No aprietes excesivamente el arco para evitar tensiones dañinas en las cerdas.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Guarda en su estuche rígido con el arco correctamente asegurado.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion: "No dejes la viola expuesta a golpes o caídas accidentales.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "En caso de fisuras en la caja de resonancia, será necesaria una reparación especializada.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion:
        "Debe devolverse con el arco en buenas condiciones y sin daños estructurales.",
    },
  ],
  trompeta: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Limpia las válvulas con aceite especial y evita la acumulación de humedad interna.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No fuerces las válvulas ni los pistones para evitar obstrucciones.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Guarda en su estuche con las boquillas y accesorios bien asegurados.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion: "No compartas la boquilla sin una correcta limpieza previa.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "Cualquier abolladura o mal funcionamiento de los pistones debe ser reportado.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion:
        "Debe devolverse sin abolladuras y con todas sus partes originales.",
    },
  ],
  acordeon: [
    {
      nombre: "Cuidado y Mantenimiento",
      descripcion:
        "Limpia el fuelle con un paño seco y evita la exposición a la humedad.",
    },
    {
      nombre: "Uso Adecuado",
      descripcion:
        "No fuerces el fuelle más allá de su apertura natural para evitar desgarros.",
    },
    {
      nombre: "Almacenamiento y Transporte",
      descripcion:
        "Mantén en su estuche cerrado cuando no esté en uso para protegerlo del polvo.",
    },
    {
      nombre: "Responsabilidad del Usuario",
      descripcion:
        "No permitas golpes en el fuelle ni presiones indebidas sobre las teclas.",
    },
    {
      nombre: "Reparación y Daños",
      descripcion:
        "Si se detecta una fuga de aire en el fuelle, debe ser reparado por un especialista.",
    },
    {
      nombre: "Condiciones de Devolución",
      descripcion:
        "Debe devolverse con todas sus teclas funcionales y sin daños en el fuelle.",
    },
  ],
};
