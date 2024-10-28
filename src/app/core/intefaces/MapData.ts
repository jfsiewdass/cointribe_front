export const TaskTypeMap: { [key: number]: string } = {
  [1]: 'Revision de documentos de residencia',
}

export const TaskStatusMap: { [key: number]: string } = {
  [1]: 'Asignada',
  [2]: 'Sin asignar',
  [3]: 'En progreso',
  [4]: 'Aprobada',
  [5]: 'Rechazada'
}

export const DocumentIdMap: { [key: number]: string } = {
  [1]: 'Cédula',
  [2]: 'Pasaporte o cita de pasaporte',
  [3]: 'Documento de residencia',
  [4]: 'Foto del elector',
}


export function getArray(map: { [key: number]: string }){
    let arr = [];
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        const element = map[key];
        var nKey = Number(key);
        if (nKey != 0){
          arr.push({key: nKey, value: element})
        }
      }
    }
    return arr;
}

export function MapToNumber(value: string, mapData: { [key: number]: string }) {
    return Object.values(mapData).indexOf(value);
}