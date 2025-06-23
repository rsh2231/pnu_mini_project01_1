// toggleSelect.ts
export const toggleSelect = (
    itemKey: string,
    selectedKeys: string[],
    setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>,
    confirm: ImagePermitRequestDTO,
    setConfirm: React.Dispatch<React.SetStateAction<ImagePermitRequestDTO>>,
    data: any[],
    originalData: ImagePermitRequestDTO,
    selectedItems: any[],
    setSelectedData: React.Dispatch<React.SetStateAction<any[]>>,
    setTotalFee: React.Dispatch<React.SetStateAction<number>>
) => {
    const [indexStr, name, type] = itemKey.split("_");
    const idx = parseInt(indexStr);
    const rename = `${name}_${type}`;

    const isAlreadySelected = selectedKeys.includes(itemKey);

    const newSelectedKeys = isAlreadySelected
        ? selectedKeys.filter((key) => key !== itemKey)
        : [...selectedKeys, itemKey];

    const newSelectedIdx = isAlreadySelected
        ? confirm.selectedIdx.filter((i) => i !== idx)
        : [...confirm.selectedIdx, idx];

    const newSelectedName = isAlreadySelected
        ? confirm.selectedname.filter((n) => n !== rename)
        : [...confirm.selectedname, rename];

    const targetItem = selectedItems.find((i) => {
        const key = `${i.furnitureList.index}_${i.furnitureList.품명}_${i.furnitureList.규격}`;
        return key === itemKey;
    });

    const fee = parseInt(targetItem?.furnitureList.수수료 || "0");


    const newSelectedData = isAlreadySelected
        ? selectedItems.filter((item: any) => {
            const key = `${item.furnitureList.index}_${item.furnitureList.품명}_${item.furnitureList.규격}`;
            return key !== itemKey;
        })
        : [...selectedItems.filter((item: any) => {
            const key = `${item.furnitureList.index}_${item.furnitureList.품명}_${item.furnitureList.규격}`;
            return selectedKeys.includes(key);
        }), selectedItems.find((item: any) => {
            const key = `${item.furnitureList.index}_${item.furnitureList.품명}_${item.furnitureList.규격}`;
            return key === itemKey;
        })];
    
    const matchedItem = data.find((item: any) => {
        const key = `${item.index}_${item.furnitureList.품명}_${item.furnitureList.규격}`;
        return key === itemKey;
    });
    console.log(matchedItem.furnitureList)
    
    setTotalFee((prev) => {
        if (isNaN(fee)) return prev;
        return isAlreadySelected ? prev - fee : prev + fee;
    });
    
    setSelectedKeys(newSelectedKeys);
    setSelectedData(
  data
    .filter((item) => {
      const key = `${item.index}_${item.furnitureList.품명}_${item.furnitureList.규격}`;
      return newSelectedKeys.includes(key);
    })
    .map(item => item.furnitureList)
);
    setConfirm({
        ...confirm,
        jobid: originalData.jobid,
        selectedIdx: newSelectedIdx,
        selectedname: newSelectedName,
    });
};
