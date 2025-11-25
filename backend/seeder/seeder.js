// backend/seeder/seeder.js
import 'dotenv/config'; // Carga el .env (¡asegúrate que esté en la raíz!)
import mongoose from 'mongoose';
import Formacion from '../models/Formacion.js'; // Nuestro modelo de Mongoose

// --- IMPORTAMOS LOS DATOS ESTÁTICOS ---
// Subimos 2 niveles (../../) a la raíz, luego bajamos a javascript/
import { arrayFormacionCursos } from '../../javascript/info-cursos.js';
import { arrayFormacionesIngenieria as arrayFormacionIngenierias } from '../../javascript/info-ingenierias.js';
import { arrayFormacionLicenciatura as arrayFormacionLicenciaturas } from '../../javascript/info-licenciaturas.js';
import { arrayFormacionTecnicatura as arrayFormacionTecnicaturas } from '../../javascript/info-tecnicatura.js';

// Conexión a la DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Conectado a MongoDB para el seeder');
  } catch (err) {
    console.error(`❌ Error en Seeder DB: ${err.message}`);
    process.exit(1);
  }
};

// --- FUNCIÓN DE IMPORTACIÓN ---
const importData = async () => {
  try {
    // 1. Limpiar la base de datos antes de importar
    await Formacion.deleteMany();

    // 2. Formatear los datos para que coincidan con el Schema
    const cursos = arrayFormacionCursos.map((item) => {
      return {
        categoria: 'curso',
        titulo: item.titulo_carrera,
        descripcion: item.informacion_de_la_carrera,
        original_id: item.id,
        instituciones: item.instituciones,
      };
    });

    const ingenierias = arrayFormacionIngenierias.map((item) => {
      return {
        categoria: 'ingenieria',
        titulo: item.titulo_carrera,
        descripcion: item.informacion_de_la_carrera,
        original_id: item.id,
        instituciones: item.instituciones,
      };
    });

    const licenciaturas = arrayFormacionLicenciaturas.map((item) => {
      return {
        categoria: 'licenciatura',
        titulo: item.titulo_carrera,
        descripcion: item.informacion_de_la_carrera,
        original_id: item.id,
        instituciones: item.instituciones,
      };
    });

    const tecnicaturas = arrayFormacionTecnicaturas.map((item) => {
      return {
        categoria: 'tecnicatura',
        titulo: item.titulo_carrera,
        descripcion: item.informacion_de_la_carrera,
        original_id: item.id,
        instituciones: item.instituciones,
      };
    });

    // 3. Unir todos los arrays
    const todasLasFormaciones = [
      ...cursos,
      ...ingenierias,
      ...licenciaturas,
      ...tecnicaturas,
    ];

    // 4. Insertar todos los datos en la colección 'Formacion'
    await Formacion.insertMany(todasLasFormaciones);

    console.log('✅ ¡Datos importados exitosamente!');
    mongoose.disconnect();
  } catch (error) {
    console.error(`❌ Error importando datos: ${error}`);
    mongoose.disconnect();
    process.exit(1);
  }
};

// --- FUNCIÓN DE DESTRUCCIÓN (Opcional pero útil) ---
const destroyData = async () => {
  try {
    await Formacion.deleteMany();
    console.log('🗑️ ¡Datos destruidos exitosamente!');
    mongoose.disconnect();
  } catch (error) {
    console.error(`❌ Error destruyendo datos: ${error}`);
    mongoose.disconnect();
    process.exit(1);
  }
};

// --- LÓGICA PARA EJECUTAR EL SCRIPT ---
const runScript = async () => {
  await connectDB();

  // process.argv[2] lee el "flag" que le pasamos (ej: -i o -d)
  if (process.argv[2] === '-d') {
    await destroyData();
  } else if (process.argv[2] === '-i') {
    await importData();
  } else {
    console.log('Script finalizado. Usa -i para importar o -d para destruir.');
    mongoose.disconnect();
  }
};

// Ejecutar el script
runScript();