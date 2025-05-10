import { Transaction } from "@mysten/sui/transactions";
import { Button, Container } from "@radix-ui/themes";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";

// Environment variables
const swordPackageId = import.meta.env.VITE_SWORD_PACKAGE_ID || "0x7a3f73fb25ba00e12d11cc4561abdf84eeaa5c64be1fe7978ee615b0503e1878";
const defaultForgeId = import.meta.env.VITE_FORGE_OBJECT_ID || "0x70f88044cdfd27ca306ef3f192fa4646f3ba6dc0b890f7cc569ce6ad7d163203";

////////////////////////////////////////////////////////////////////////////////
// 1) Create a new Sword
export function CreateSword() {
    const { mutate: createTx } = useSignAndExecuteTransaction();
    const [magic, setMagic] = useState("");
    const [strength, setStrength] = useState("");
    const [recipient, setRecipient] = useState("");
    const [loading, setLoading] = useState(false);
    const forgeId = defaultForgeId;
  
    function create() {
      setLoading(true);
      const tx = new Transaction();
      tx.moveCall({
        target: `${swordPackageId}::sword::sword_create`,
        arguments: [
            tx.pure.u64(magic), 
            tx.pure.u64(strength), 
            tx.pure.address(recipient), 
            tx.object(forgeId)
        ],
      });
  
      createTx(
        { transaction: tx },
        {
          onSuccess: ({ digest }) => {
            alert(`Sword created! Tx Digest: ${digest}`);
            setLoading(false);
          },
          onError: (error) => {
            alert(`Transaction failed: ${error}`);
            setLoading(false);
          }
        }
      );
    }
  
    return (
      <Container>
        <label>Magic:</label>
        <input value={magic} onChange={e => setMagic(e.target.value)} />
        <label>Strength:</label>
        <input value={strength} onChange={e => setStrength(e.target.value)} />
        <label>Recipient:</label>
        <input value={recipient} onChange={e => setRecipient(e.target.value)} />
        <Button size="3" onClick={create} disabled={loading}>
          {loading ? <ClipLoader size={20} /> : "Create Sword"}
        </Button>
      </Container>
    );
  }

////////////////////////////////////////////////////////////////////////////////
// 2) Transfer an existing Sword
export function TransferSword() {
  const { mutate: txMutate} = useSignAndExecuteTransaction();
  const [swordId, setSwordId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);

  function transfer() {
    const tx = new Transaction();
    tx.moveCall({
        target: `${swordPackageId}::sword::sword_transfer`,
        arguments: [
            tx.object(swordId), 
            tx.pure.address(recipient)
        ],
    });
    txMutate(
        { transaction: tx },
        {
            onSuccess: ({ digest }) => {
              alert(`Transfer Sword Tx Digest: ${digest}`);
              setLoading(false);
            },
            onError: (error) => {
              alert(`Transaction failed: ${error}`);
              setLoading(false);
            }
          }
    );
  }

  return (
    <Container>
      <label>Sword ID:</label>
      <input value={swordId} onChange={e => setSwordId(e.target.value)} />
      <label>New Owner:</label>
      <input value={recipient} onChange={e => setRecipient(e.target.value)} />
      <Button size="3" onClick={transfer} disabled={loading}>
        {loading ? <ClipLoader size={20} /> : "Transfer Sword"}
      </Button>
    </Container>
  );
}

////////////////////////////////////////////////////////////////////////////////
// 3) Request a Swap (attach SUI fee)
export function RequestSwap() {
  const { mutate: swapTx, isPending, isSuccess } = useSignAndExecuteTransaction();
  const [swordId, setSwordId] = useState("");
  const [fee, setFee] = useState("");
  const [serviceAddr, setServiceAddr] = useState("");

  function request() {
    const tx = new Transaction();
    tx.moveCall({
      target: `${swordPackageId}::sword::request_swap`,
      arguments: [swordId, fee, serviceAddr],
    });
    swapTx({ transaction: tx });
  }

  return (
    <Container>
      <label>Sword ID:</label>
      <input value={swordId} onChange={e => setSwordId(e.target.value)} />
      <label>Fee Coin ID:</label>
      <input value={fee} onChange={e => setFee(e.target.value)} />
      <label>Service Address:</label>
      <input value={serviceAddr} onChange={e => setServiceAddr(e.target.value)} />
      <Button size="3" onClick={request} disabled={isPending || isSuccess}>
        {isPending || isSuccess ? <ClipLoader size={20} /> : "Request Swap"}
      </Button>
    </Container>
  );
}
