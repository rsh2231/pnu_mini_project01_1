'use client'

import { toggleSelect } from "./toggleSelect";


type SortedItem = {
    furnitureList: { 
        id: number,
        index:number,
        연번:string,
        품명:string,
        규격:string,
        수수료:string
    }; 
};

type ItemListProps = {
    sorteditems: SortedItem[];
    selectedKeys: string[];
    onToggle: (key: string) => void;
};

export default function ItemList( { sorteditems, selectedKeys, onToggle} :  ItemListProps) {
    
    const tags = sorteditems.map(i =>{
        const f = i.furnitureList;
        const key = `${f.index}_${f.품명}_${f.규격}`;
        const isSelected = selectedKeys.includes(key);
        return (
            <button
                key={i.furnitureList.index}
                onClick={() => onToggle(key)}
                className={`w-full text-left rounded-lg px-3 py-2 sm:px-4 sm:py-3 border transition
                    ${
                        isSelected
                            ? "bg-blue-50 border-blue-400 font-semibold text-blue-800 shadow"
                            : "bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    }
                `}
                type="button"
            >
                <span className="mr-2 text-gray-400">{i.furnitureList.연번}.</span>
                <span className="mr-2 text-gray-400">{i.furnitureList.품명}.</span>
                <span className="mr-2 text-gray-400">{i.furnitureList.규격}.</span>
                <span className="mr-2 text-gray-400">{i.furnitureList.수수료}.</span>
            </button>
        )
    })
    return (
        <div className="flex flex-col space-y-2 sm:space-y-3 text-gray-800 text-sm sm:text-base mb-8">
            {tags}
        </div>
    );
}