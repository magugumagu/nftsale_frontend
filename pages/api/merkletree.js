import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'

export default async (req,res) => {
  const address = req.query.address
  console.log(address)
  if (!address) {
   res.statusCode=400 
   res.body='Set address on API' 
  }
  const addressesLower = addresses.map((x) => x.toLowerCase())
  const addressLower = address
  //.toLowerCase()

  const leafNodes = addressesLower.map((x) => keccak256(x))
  const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  const nodeIndex  = addressesLower.indexOf(addressLower)
  const rootHash = tree.getRoot()
  console.log('rootHash:', tree.getHexRoot())

  console.log('address:', addressLower, 'nodeindex:', nodeIndex)

  if (nodeIndex === -1) {
    res.statusCode=400, 
    res.body="Your Address don't eligible whitelist" 
    res.end()
  }
  const hashedAddress = keccak256(addressLower)
  const hexProof = tree.getHexProof(hashedAddress)
  const verify = tree.verify(hexProof, hashedAddress, rootHash)

  if (!verify) {
   
      res.statusCode= 400
      res.json(JSON.stringify({
        address,
        message: 'your address can not verify'
      }))
      res.end()
    
  } else{


    res.statusCode=200,
    res.json( JSON.stringify({
      hexProof,
    }))
    res.end()
  
}
}
const addresses = [
  '0x79611EEd03B52b7A1B89b28a6ff7c40aF3e58B0c',
  '0xb13dAc27BEbF08778ac5aEC9387E56413773B875',
  '0x8c4f94242349F91660399A4c6b9950331E2b3794',
  '0x5f0e2edF0cBE3085b99285b8fB9DCAB9399610Bc',
  '0xaf501dE56E1fc8064200Ba147B5Dc7309B274A35'
]