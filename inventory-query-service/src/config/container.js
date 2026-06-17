import { GetStockByBranchUseCase } from "../application/use-cases/GetStockByBranchUseCase.js"
import { GetStockUseCase } from "../application/use-cases/GetStockUseCase.js"
import { ListEventsUseCase } from "../application/use-cases/ListEventsUseCase.js"
import { ListMovementsUseCase } from "../application/use-cases/ListMovementsUseCase.js"
import { ListProductsUseCase } from "../application/use-cases/ListProductsUseCase.js"
import { ListBranchesUseCase } from "../application/use-cases/ListBranchesUseCase.js"
import { ListStockTypesUseCase } from "../application/use-cases/ListStockTypesUseCase.js"
import { PrismaReadRepository } from "../adapters/out/database/prismaReadRepository.js"

const readRepository = new PrismaReadRepository()

export const container = {
  listProductsUseCase: new ListProductsUseCase(readRepository),
  getStockUseCase: new GetStockUseCase(readRepository),
  getStockByBranchUseCase: new GetStockByBranchUseCase(readRepository),
  listMovementsUseCase: new ListMovementsUseCase(readRepository),
  listEventsUseCase: new ListEventsUseCase(readRepository),
  listBranchesUseCase: new ListBranchesUseCase(readRepository),
  listStockTypesUseCase: new ListStockTypesUseCase(readRepository)
}
