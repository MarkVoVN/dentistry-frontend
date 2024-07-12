import { Smile } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { DentistModel, getDentistList } from "@/lib/api/dentistAPI";
import { useQuery } from "@tanstack/react-query";

interface Props {
  setReceiverId: any;
  open: boolean;
  setOpen: any;
  setDentist: any;  
}
export default function ChatSearch({ setReceiverId, open, setOpen, setDentist }: Props) {
  const [dentists, setDentists] = useState<DentistModel[]>([]);
  const { data: req_data, isSuccess } = useQuery({
    queryKey: ["dentists"],
    queryFn: getDentistList,
  });

  useEffect(() => {
    if (isSuccess && req_data) {
      const { data: dentists } = req_data;
      setDentists(dentists);
    }
  }, [isSuccess, req_data]);

  const handleSetReceiverId = (dentist: DentistModel) => {
    setReceiverId(dentist.id!);
    setDentist(dentist);
    setOpen(false);
  };
  return (
    <CommandDialog open={open} onOpenChange={setOpen} modal={true}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Dentists">
          {dentists.map((dentist) => (
            <CommandItem
              key={dentist.dentistId}
              onSelect={() => handleSetReceiverId(dentist)}
            >
              <Smile className="mr-2 h-4 w-4" />
              <span>{dentist.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );

}
