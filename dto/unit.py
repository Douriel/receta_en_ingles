from pydantic import BaseModel
from uuid import UUID
from bbdd_v3 import UnitModel

class UnitDto(BaseModel):
    uuid : str
    name : str

    @staticmethod
    def from_model(unit_model:UnitModel):
        return UnitDto(uuid = unit_model.uuid,
                       name = unit_model.name)