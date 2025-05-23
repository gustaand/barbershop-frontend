import { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import './Calendario/Calendar.css';
import { FaRegCalendar } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import { formatInTimeZone } from 'date-fns-tz';
import useAdmin from '../hooks/useAdmin';

const ModalCrearCita = ({ onClose }) => {
  const {
    crearCita,
    editarCita,
    horarios,
    obtenerHorarios,
    citaParaActualizar,
    setCitaParaActualizar,
  } = useAdmin();

  const fechaHoy = formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd');
  const [showCalendario, setShowCalendario] = useState(false);
  const [id, setId] = useState('');
  const [fecha, setFecha] = useState(fechaHoy);
  const [horaObject, setHoraObject] = useState({ hora: '' });
  const [horaID, setHoraID] = useState('');
  const [horaAnteriorID, setHoraAnteriorID] = useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [servicio, setServicio] = useState('');

  const servicios = [
    "Corte Clásico",
    "Arreglo de Barba",
    "Afeitado Tradicional",
    "Corte y Barba",
    "Corte Infantil",
    "Tratamientos Capilares",
  ];

  useEffect(() => {
    if (citaParaActualizar?._id) {
      setId(citaParaActualizar._id);
      setFecha(citaParaActualizar.fecha || fechaHoy);
      setHoraObject(citaParaActualizar.hora || { hora: '' });
      setNombreCliente(citaParaActualizar.nombreCliente || '');
      setTelefono(citaParaActualizar.telefono || '');
      setServicio(citaParaActualizar.servicio || '');

      // Guarda la hora anterior antes de modificarla
      setHoraAnteriorID(citaParaActualizar.hora?._id || '');
      setHoraID(citaParaActualizar.hora?._id || '');
    }
  }, [citaParaActualizar]);

  useEffect(() => {
    if (!Array.isArray(horarios)) return;

    const horariosFiltrados = horarios.filter(
      (horario) => !horario.fecha.includes(fecha)
    );

    setHorariosDisponibles(horariosFiltrados);
    if (horariosFiltrados.length > 0) {
      setHoraObject(horariosFiltrados[0]);
      setHoraID(horariosFiltrados[0]._id);
    } else {
      setHoraObject({ hora: '' });
      setHoraID('');
    }
  }, [fecha, horarios]);

  const handleDateCalendar = (date) => {
    setFecha(formatInTimeZone(date, 'Europe/Madrid', 'yyyy-MM-dd'));
    setShowCalendario(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!horaObject.hora || !horaID) return;

    try {
      const datosCita = { fecha, hora: horaObject, nombreCliente, telefono, servicio };

      if (id) {
        await editarCita({ id, ...datosCita }, horaAnteriorID);
        setCitaParaActualizar({});
      } else {
        await crearCita(datosCita, horaID);
      }

      await obtenerHorarios();
      onClose();
    } catch (error) {
      console.error('Error al gestionar la cita:', error);
    }
  };

  return (
    <div className='fixed flex justify-center items-center inset-0 z-40'>
      <div className='absolute inset-0 bg-black opacity-50' onClick={onClose}></div>

      <form
        className='flex flex-col gap-2 items-center w-4/5 bg-slate-100 dark:bg-zinc-800 pt-5 rounded-md shadow-md z-10 px-2'
        onSubmit={handleSubmit}
      >
        <h2 className='text-xl text-center mb-3 border-b border-slate-300 dark:border-zinc-600 w-full pb-2 dark:text-white'>
          {id ? 'Actualizar Cita' : 'Crear Cita'}
        </h2>

        <label className='flex w-full justify-between items-center gap-3 px-2' onClick={() => setShowCalendario(true)}>
          <p className='text-xl dark:text-white'>Fecha:</p>
          <div className='flex items-center justify-between rounded bg-white dark:bg-zinc-700 dark:text-white w-7/12 p-2'>
            <p className='w-5/6 text-center'>{fecha.split('-').reverse().join('-')}</p>
            <FaRegCalendar className='cursor-pointer w-1/6' />
          </div>
        </label>

        <label className='flex w-full justify-between items-center gap-3 px-2'>
          <p className='text-xl dark:text-white'>Hora:</p>
          <select
            value={horaObject.hora}
            className='rounded bg-white dark:bg-zinc-700 dark:text-white w-7/12 p-2 text-center'
            onChange={(e) => {
              const selectedHora = horariosDisponibles.find(
                (horario) => horario.hora === e.target.value
              );
              setHoraObject(selectedHora || { hora: '' });
              setHoraID(selectedHora?._id || '');
            }}
          >
            {horariosDisponibles.length ? (
              horariosDisponibles.map((horario) => (
                <option key={horario._id} value={horario.hora}>
                  {horario.hora}
                </option>
              ))
            ) : (
              <option disabled>---</option>
            )}
          </select>
        </label>

        <label className='flex w-full justify-between items-center gap-3 px-2'>
          <p className='text-xl dark:text-white'>Cliente:</p>
          <input
            className='p-2 rounded w-7/12 text-center dark:bg-zinc-700 dark:text-white'
            type='text'
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
        </label>

        <label className='flex w-full justify-between items-center gap-3 px-2'>
          <p className='text-xl dark:text-white'>Teléfono:</p>
          <input
            className='p-2 rounded w-7/12 text-center dark:bg-zinc-700 dark:text-white'
            type='text'
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </label>

        <label className='flex w-full justify-between items-center gap-3 px-2'>
          <p className='text-xl dark:text-white'>Servicio:</p>
          <select
            className='rounded bg-white dark:bg-zinc-700 dark:text-white w-7/12 p-2 text-center'
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
          >
            {servicios.map((servicio, index) => (
              <option key={index} value={servicio}>
                {servicio}
              </option>
            ))}
          </select>
        </label>

        <div className='flex justify-between items-center w-full border-t border-slate-300 dark:border-zinc-600 mt-3'>
          <button type='submit' className='p-4 w-1/2 text-black dark:text-white active:bg-gray-200 dark:active:bg-zinc-700'>
            {id ? 'Actualizar' : 'Crear Cita'}
          </button>
          <div className='border-l h-9 border-slate-300 dark:border-zinc-600'></div>
          <button type='button' className='p-4 w-1/2 text-black dark:text-white active:bg-gray-200 dark:active:bg-zinc-700' onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>

      {showCalendario && (
        <div className='fixed flex-col justify-center flex w-full h-full rounded-md shadow-md z-10'>
          <div className='absolute inset-0' onClick={() => setShowCalendario(false)}></div>
          <div className='bg-white dark:bg-zinc-800 z-10'>
            <div className='flex w-full justify-end px-2 py-4'>
              <button className='active:scale-125 transition-transform px-4 text-black dark:text-white' onClick={() => setShowCalendario(false)}>
                <GrClose />
              </button>
            </div>
            <ReactCalendar
              minDate={new Date()}
              className='border-none px-2 pb-5 dark:bg-zinc-800 dark:text-white'
              view='month'
              onClickDay={handleDateCalendar}
            />
          </div>
        </div>
      )}
    </div>
  )

};

export default ModalCrearCita;
