import '../css/style.css'
import '../css/avanzado.css'
import '../css/foro.css'
import '../css/donacion.css'
import '../javascript/foro.js'
import '../javascript/donacion.js'

import * as infoIngenieria from '../javascript/info-ingenierias.js'
import * as infoLicenciatura from '../javascript/info-licenciaturas.js'
import * as infoTecnicatura from '../javascript/info-tecnicatura.js'
import * as infoCurso from '../javascript/info-cursos.js'

// console.log(InfoIngenieria.arrayFormacionesIngenieria)

window.addEventListener('DOMContentLoaded', function() {
    
    const divSlider = document.querySelector('#id-slider-ingenieria')

    infoIngenieria.arrayFormacionesIngenieria.forEach(function(dato) {
        const divSliderSectionIngenieria = document.createElement('div')
        divSliderSectionIngenieria.classList.add('slider-section-ingenieria')

        const nombreDeLaCarreraIngenieria = document.createElement('h3')
        nombreDeLaCarreraIngenieria.classList.add('titulo-de-la-carrera')

        const infoDeLaCarreraIngenieria = document.createElement('p')
        infoDeLaCarreraIngenieria.classList.add('info-sobre-la-carrera')

        const subTituloCarreraIngenieria = document.createElement('h4')
        subTituloCarreraIngenieria.classList.add('subtitulo-para-las-facultades')

        // console.log(divSliderSecctionIngenieria, nombreDeLaCarreraIngenieria, infoDeLaCarreraIngenieria)

        /* asigno la info */
        nombreDeLaCarreraIngenieria.textContent = dato.titulo_carrera
        infoDeLaCarreraIngenieria.textContent = dato.informacion_de_la_carrera
        subTituloCarreraIngenieria.textContent = "Lo podes estudiar en las siguientes instituciones"

        divSliderSectionIngenieria.classList.add('slider-section-ingenieria')

        // ! Y agrego el contenido al elemento contenedor (slider-section-ingenieria)
        divSliderSectionIngenieria.appendChild(nombreDeLaCarreraIngenieria)
        divSliderSectionIngenieria.appendChild(infoDeLaCarreraIngenieria)
        divSliderSectionIngenieria.appendChild(subTituloCarreraIngenieria)


        dato.instituciones.forEach(function(facultad) {
            // console.log(facultad)

            const divSliderFacultades = document.createElement('div')
            divSliderFacultades.classList.add('slider-facultades')

            const nombreFacultadCarreraIngenieria = document.createElement('a')
            nombreFacultadCarreraIngenieria.classList.add('nombre-de-la-facultad')

            const mensajeCarreraIngenieria = document.createElement('p')
            mensajeCarreraIngenieria.classList.add('info-sobre-la-facultad')

            nombreFacultadCarreraIngenieria.textContent = facultad.nombre_instituto
            nombreFacultadCarreraIngenieria.href = facultad.url
            nombreFacultadCarreraIngenieria.target = "_blank"
            mensajeCarreraIngenieria.textContent = facultad.mensaje

            divSliderFacultades.appendChild(nombreFacultadCarreraIngenieria)
            divSliderFacultades.appendChild(mensajeCarreraIngenieria)
            divSliderSectionIngenieria.appendChild(divSliderFacultades)

        })

        
        // ! A nuestro contenedor con el ID 'slider' le agrego cada una de las imagenes
        divSlider.appendChild(divSliderSectionIngenieria)

    })

    // ! Agregar eventos al proyecto

    const btnLeft = document.querySelector('.btn-left-ingenieria')
    const btnRight = document.querySelector('.btn-right-ingenieria')
    // console.log(btnLeft, btnRight)

    const sliderSection = document.querySelectorAll('.slider-section-ingenieria')
    // console.log(sliderSection) // NodeList -> []

    let operacion = 0
    let widthInge = 100 / sliderSection.length
    let counter = 0
    // console.log(widthInge)

    function moverALaDerecha() {
    
        if (counter >= sliderSection.length-1) {
            // console.log('derecha')
            counter = 0
            operacion = 0
            divSlider.style.transform = `translate(-${operacion}%)`

        } else {
            counter++
            operacion = operacion + widthInge
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }
    }
        
    function moverALaIzquierda() {
        // console.log('izquierda')
        // debugger
        counter--
        if (counter < 0) {
            counter = sliderSection.length-1
            operacion = widthInge * (sliderSection.length-1)
            divSlider.style.transform = `translate(-${operacion}%)`
        } 
        
        else if (counter === 0) {
            operacion = 0
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }

        else {
            // debugger
            operacion = operacion - widthInge
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }
    }

    btnLeft.addEventListener('click', moverALaIzquierda)

    btnRight.addEventListener('click', moverALaDerecha)

})

// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------


window.addEventListener('DOMContentLoaded', function() {
    
    const divSlider = document.querySelector('#id-slider-licenciatura')

    infoLicenciatura.arrayFormacionLicenciatura.forEach(function(dato) {
        const divSliderSectionLicenciatura = document.createElement('div')
        divSliderSectionLicenciatura.classList.add('slider-section-licenciatura')

        const nombreDeLaCarreraLicenciatura = document.createElement('h3')
        nombreDeLaCarreraLicenciatura.classList.add('titulo-de-la-carrera')

        const infoDeLaCarreraLicenciatura = document.createElement('p')
        infoDeLaCarreraLicenciatura.classList.add('info-sobre-la-carrera')

        const subtituloCarreraLicenciatura = document.createElement('h4')
        subtituloCarreraLicenciatura.classList.add('subtitulo-para-las-facultades')

        // console.log(divSliderSecctionIngenieria, nombreDeLaCarreraLicenciatura, infoDeLaCarreraLicenciatura)

        /* asigno la info */
        nombreDeLaCarreraLicenciatura.textContent = dato.titulo_carrera
        infoDeLaCarreraLicenciatura.textContent = dato.informacion_de_la_carrera
        subtituloCarreraLicenciatura.textContent = "Lo podes estudiar en las siguientes instituciones"

        divSliderSectionLicenciatura.classList.add('slider-section-licenciatura')

        // ! Y agrego el contenido al elemento contenedor (slider-section-licenciatura)
        divSliderSectionLicenciatura.appendChild(nombreDeLaCarreraLicenciatura)
        divSliderSectionLicenciatura.appendChild(infoDeLaCarreraLicenciatura)
        divSliderSectionLicenciatura.appendChild(subtituloCarreraLicenciatura)


        dato.instituciones.forEach(function(facultad) {
            // console.log(facultad)
            
            const NombreFacultadCarreraLicenciatura = document.createElement('a')
            NombreFacultadCarreraLicenciatura.classList.add('nombre-de-la-facultad')

            const mensajeCarreraLicenciatura = document.createElement('p')
            mensajeCarreraLicenciatura.classList.add('info-sobre-la-facultad')

            NombreFacultadCarreraLicenciatura.textContent = facultad.nombre_instituto
            NombreFacultadCarreraLicenciatura.href = facultad.url
            NombreFacultadCarreraLicenciatura.target = "_blank"
            mensajeCarreraLicenciatura.textContent = facultad.mensaje

            divSliderSectionLicenciatura.appendChild(NombreFacultadCarreraLicenciatura)
            divSliderSectionLicenciatura.appendChild(mensajeCarreraLicenciatura)

        })

        
        // ! A nuestro contenedor con el ID 'slider' le agrego cada una de las imagenes
        divSlider.appendChild(divSliderSectionLicenciatura)

    })

    // ! Agregar eventos al proyecto

    const btnLeft = document.querySelector('.btn-left-licenciatura')
    const btnRight = document.querySelector('.btn-right-licenciatura')
    // console.log(btnLeft, btnRight)

    const sliderSectionLicenciatura = document.querySelectorAll('.slider-section-licenciatura')
    // console.log(sliderSectionLicenciatura) // NodeList -> []

    let operacion = 0
    let widthLicenciatura = 100 / sliderSectionLicenciatura.length
    let counter = 0
    // console.log(widthLicenciatura)

    function moverALaDerecha() {
        // debugger
        if (counter >= sliderSectionLicenciatura.length-1) {
            // console.log('derecha')
            counter = 0
            operacion = 0
            divSlider.style.transform = `translate(-${operacion}%)`

        } else {
            counter++
            operacion = operacion + widthLicenciatura
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }
    }
        
    function moverALaIzquierda() {
        // console.log('izquierda')
        // debugger
        counter--
        if (counter < 0) {
            counter = sliderSectionLicenciatura.length-1
            operacion = widthLicenciatura * (sliderSectionLicenciatura.length-1)
            divSlider.style.transform = `translate(-${operacion}%)`
        } 
        
        else if (counter === 0) {
            operacion = 0
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }

        else {
            // debugger
            operacion = operacion - widthLicenciatura
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }
    }

    btnLeft.addEventListener('click', moverALaIzquierda)

    btnRight.addEventListener('click', moverALaDerecha)

})

// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------


window.addEventListener('DOMContentLoaded', function() {
    
    const divSlider = document.querySelector('#id-slider-tecnicatura')

    infoTecnicatura.arrayFormacionTecnicatura.forEach(function(dato) {
        const divSliderSectionTecnicatura = document.createElement('div')
        divSliderSectionTecnicatura.classList.add('slider-section-tecnicatura')

        const nombreDeLaCarreraTecnicatura = document.createElement('h3')
        nombreDeLaCarreraTecnicatura.classList.add('titulo-de-la-carrera')

        const infoDeLaCarreraTecnicatura = document.createElement('p')
        infoDeLaCarreraTecnicatura.classList.add('info-sobre-la-carrera')

        const subtituloCarreraTecnicatura = document.createElement('h4')
        subtituloCarreraTecnicatura.classList.add('subtitulo-para-las-facultades')

        


        // console.log(divSliderSecctionIngenieria, nombreDeLaCarreraTecnicatura, infoDeLaCarreraTecnicatura)

        /* asigno la info */
        nombreDeLaCarreraTecnicatura.textContent = dato.titulo_carrera
        infoDeLaCarreraTecnicatura.textContent = dato.informacion_de_la_carrera
        subtituloCarreraTecnicatura.textContent = "Lo podes estudiar en las siguientes instituciones"

        divSliderSectionTecnicatura.classList.add('slider-section-tecnicatura')

        // ! Y agrego el contenido al elemento contenedor (slider-section-Tecnicatura)
        divSliderSectionTecnicatura.appendChild(nombreDeLaCarreraTecnicatura)
        divSliderSectionTecnicatura.appendChild(infoDeLaCarreraTecnicatura)
        divSliderSectionTecnicatura.appendChild(subtituloCarreraTecnicatura)


        dato.instituciones.forEach(function(facultad) {
            // console.log(facultad)
            
            const NombreFacultadCarreraTecnicatura = document.createElement('a')
            NombreFacultadCarreraTecnicatura.classList.add('nombre-de-la-facultad')

            const mensajeCarreraTecnicatura = document.createElement('p')
            mensajeCarreraTecnicatura.classList.add('info-sobre-la-facultad')

            NombreFacultadCarreraTecnicatura.textContent = facultad.nombre_instituto
            NombreFacultadCarreraTecnicatura.href = facultad.url
            NombreFacultadCarreraTecnicatura.target = "_blank"
            mensajeCarreraTecnicatura.textContent = facultad.mensaje

            divSliderSectionTecnicatura.appendChild(NombreFacultadCarreraTecnicatura)
            divSliderSectionTecnicatura.appendChild(mensajeCarreraTecnicatura)

        })

        
        // ! A nuestro contenedor con el ID 'slider' le agrego cada una de las imagenes
        divSlider.appendChild(divSliderSectionTecnicatura)

    })

    // ! Agregar eventos al proyecto

    const btnLeft = document.querySelector('.btn-left-tecnicatura')
    const btnRight = document.querySelector('.btn-right-tecnicatura')
    // console.log(btnLeft, btnRight)

    const sliderSectionTecnicatura = document.querySelectorAll('.slider-section-tecnicatura')
    // console.log(sliderSectionTecnicatura) // NodeList -> []

    let operacion = 0
    let widthTecnicatura = 100 / sliderSectionTecnicatura.length
    let counter = 0
    // console.log(widthTecnicatura)

    function moverALaDerecha() {
        // debugger
        if (counter >= sliderSectionTecnicatura.length-1) {
            // console.log('derecha')
            counter = 0
            operacion = 0
            divSlider.style.transform = `translate(-${operacion}%)`

        } else {
            counter++
            operacion = operacion + widthTecnicatura
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }
    }
        
    function moverALaIzquierda() {
        // console.log('izquierda')
        // debugger
        counter--
        if (counter < 0) {
            counter = sliderSectionTecnicatura.length-1
            operacion = widthTecnicatura * (sliderSectionTecnicatura.length-1)
            divSlider.style.transform = `translate(-${operacion}%)`
        } 
        
        else if (counter === 0) {
            operacion = 0
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }

        else {
            // debugger
            operacion = operacion - widthTecnicatura
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }
    }

    btnLeft.addEventListener('click', moverALaIzquierda)

    btnRight.addEventListener('click', moverALaDerecha)

})


// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------
// ! ---------------------------------------------------------


window.addEventListener('DOMContentLoaded', function() {
    
    const divSlider = document.querySelector('#id-slider-curso')

    infoCurso.arrayFormacionCursos.forEach(function(dato) {
        const divSliderSectionCurso = document.createElement('div')
        divSliderSectionCurso.classList.add('slider-section-curso')

        const nombreDeLaCarreraCurso = document.createElement('h3')
        nombreDeLaCarreraCurso.classList.add('titulo-de-la-carrera')

        const infoDeLaCarreraCurso = document.createElement('p')
        infoDeLaCarreraCurso.classList.add('info-sobre-la-carrera')

        const subtituloCarreraCurso = document.createElement('h4')
        subtituloCarreraCurso.classList.add('subtitulo-para-las-facultades')

        


        // console.log(divSliderSecctionIngenieria, nombreDeLaCarreraCurso, infoDeLaCarreraCurso)

        /* asigno la info */
        nombreDeLaCarreraCurso.textContent = dato.titulo_carrera
        infoDeLaCarreraCurso.textContent = dato.informacion_de_la_carrera
        subtituloCarreraCurso.textContent = "Lo podes estudiar en las siguientes instituciones"

        divSliderSectionCurso.classList.add('slider-section-curso')

        // ! Y agrego el contenido al elemento contenedor (slider-section-Curso)
        divSliderSectionCurso.appendChild(nombreDeLaCarreraCurso)
        divSliderSectionCurso.appendChild(infoDeLaCarreraCurso)
        divSliderSectionCurso.appendChild(subtituloCarreraCurso)


        dato.instituciones.forEach(function(facultad) {
            // console.log(facultad)
            
            const NombreFacultadCarreraCurso = document.createElement('a')
            NombreFacultadCarreraCurso.classList.add('nombre-de-la-facultad')

            const mensajeCarreraCurso = document.createElement('p')
            mensajeCarreraCurso.classList.add('info-sobre-la-facultad')

            NombreFacultadCarreraCurso.textContent = facultad.nombre_instituto
            NombreFacultadCarreraCurso.href = facultad.url
            NombreFacultadCarreraCurso.target = "_blank"
            mensajeCarreraCurso.textContent = facultad.mensaje

            divSliderSectionCurso.appendChild(NombreFacultadCarreraCurso)
            divSliderSectionCurso.appendChild(mensajeCarreraCurso)

        })

        
        // ! A nuestro contenedor con el ID 'slider' le agrego cada una de las imagenes
        divSlider.appendChild(divSliderSectionCurso)

    })

    // ! Agregar eventos al proyecto

    const btnLeft = document.querySelector('.btn-left-curso')
    const btnRight = document.querySelector('.btn-right-curso')
    // console.log(btnLeft, btnRight)

    const sliderSectionCurso = document.querySelectorAll('.slider-section-curso')
    // console.log(sliderSectionCurso) // NodeList -> []

    let operacion = 0
    let widthCurso = 100 / sliderSectionCurso.length
    let counter = 0
    // console.log(widthCurso)

    function moverALaDerecha() {
        // debugger
        if (counter >= sliderSectionCurso.length-1) {
            // console.log('derecha')
            counter = 0
            operacion = 0
            divSlider.style.transform = `translate(-${operacion}%)`

        } else {
            counter++
            operacion = operacion + widthCurso
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }
    }
        
    function moverALaIzquierda() {
        // console.log('izquierda')
        // debugger
        counter--
        if (counter < 0) {
            counter = sliderSectionCurso.length-1
            operacion = widthCurso * (sliderSectionCurso.length-1)
            divSlider.style.transform = `translate(-${operacion}%)`
        } 
        
        else if (counter === 0) {
            operacion = 0
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }

        else {
            // debugger
            operacion = operacion - widthCurso
            divSlider.style.transform = `translate(-${operacion}%)`
            divSlider.style.transition = 'transform ease 1s'
        }
    }

    btnLeft.addEventListener('click', moverALaIzquierda)

    btnRight.addEventListener('click', moverALaDerecha)

})

/* BOTON PARA VOLVER AL PRINCIPIO DE LA PAGINA - UBICADO EN LA PARTE INFERIOR DERECHA */
document.getElementById('btn-para-arriba').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
