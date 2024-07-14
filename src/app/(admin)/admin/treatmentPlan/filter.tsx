import { Column, Table } from "@tanstack/react-table"
import React from "react"

export function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  // Determinar el tipo de valor
	let valueType = '';
	if (typeof firstValue === "number") {
		valueType = 'number';
	}
	else if (typeof firstValue === "string") {
		valueType = 'string';
	}
	else if (typeof firstValue === "object") {
		// Asegurarse de diferenciar entre objetos y arrays
		valueType = Array.isArray(firstValue) ? 'array' : 'object';
	}

	switch (valueType) {
		case 'number':
			return (
                <>
                {/* case Numbers */}
                </>
			);
		case 'string':
			return (
				<>
					<datalist id={column.id + "list"}>
						{sortedUniqueValues.slice(0, 5000).map((value: any, index: number) => (
							<option value={value} key={`${value}-${index}`} />
						))}
					</datalist>
					<DebouncedInput
						type="text"
						value={(columnFilterValue ?? "") as string}
						onChange={(value) => column.setFilterValue(value)}
						placeholder={` (${column.columnDef.header}) (${column.getFacetedUniqueValues().size
							})`}
						className="w-full border shadow rounded text-sm ps-2 py-1"
						list={column.id + "list"}
					/>

				</>
			);
		case 'array':
			return (
				<>
					{/* <datalist id={column.id + "list"}>
						{sortedUniqueValues.slice(0, 5000).map((value: any, index: number) => (
							Array.isArray(value) ? (
								value.map((val, idx) => (
									<option value={val.name} key={`${val.name}-${idx}`} />
								))
							) : (
								<option value={value} key={`${value}-${index}`} />
							)
						))}
					</datalist>
					<DebouncedInput
						type="text"
						value={(columnFilterValue ?? "") as string}
						onChange={(value) => column.setFilterValue(value)}
						placeholder={` (${column.columnDef.header}) (${column.getFacetedUniqueValues().size
							})`}
						className="w-36 border shadow rounded text-sm ps-2 py-1"
						list={column.id + "list"}
					/> */}
				</>
			);
		case 'object':
			return (
				<>
					{/* case object */}
				</>
			);
		default:
			return null
	}
}

// A debounced input react component
export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}