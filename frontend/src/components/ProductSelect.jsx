import { useState, useRef, useEffect, useMemo } from "react"

export function ProductSelect({ products, value, onChange, placeholder = "Produto", required = false }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedLabel, setSelectedLabel] = useState("")
  const ref = useRef(null)

  const filtered = useMemo(() => {
    if (!query) return products
    const lower = query.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.sku.toLowerCase().includes(lower)
    )
  }, [products, query])

  const selected = useMemo(() => {
    return products.find((p) => p.id === value)
  }, [products, value])

  useEffect(() => {
    if (selected) {
      setSelectedLabel(`${selected.name} - ${selected.sku}`)
      setQuery("")
    } else {
      setSelectedLabel("")
    }
  }, [selected])

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleInputChange(e) {
    const value = e.target.value
    setQuery(value)
    if (value !== selectedLabel) {
      onChange("")
    }
    if (!open) setOpen(true)
  }

  function handleSelect(product) {
    onChange(product.id)
    setOpen(false)
  }

  function handleFocus() {
    setQuery("")
    setOpen(true)
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") setOpen(false)
    if (e.key === "Enter" && open && filtered.length > 0) {
      handleSelect(filtered[0])
    }
  }

  return (
    <div className="product-select" ref={ref}>
      <input
        type="text"
        value={open ? query : selectedLabel}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {open && (
        <ul className="product-select-dropdown">
          {filtered.length === 0 ? (
            <li className="product-select-empty">Nenhum produto encontrado</li>
          ) : (
            filtered.map((product) => (
              <li
                key={product.id}
                className={`product-select-item${product.id === value ? " selected" : ""}`}
                onMouseDown={() => handleSelect(product)}
              >
                <span className="product-select-name">{product.name}</span>
                <span className="product-select-sku">{product.sku}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
