import ItemCard from "./ItemCard";

type Item = {
    id: string
    label: string
    checked: boolean
}

type Props = {
    items: Item[]
    onToggle: (id: string ) => void
    onDelete: (id: string ) => void
}

