var Map = function()
{
    this.include = [];
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = 0;
    this.height = 0;
    this.tiles = [];
    this.name = "Untitled";

    this.setTile = function(x, y, id)
    {
        if(x + this.offsetX < 0)
        {
            for(var i = 0; i < (-x - this.offsetX); i++)
            {
                this.tiles.unshift([]);
            }
            this.width += (-x - this.offsetX);
            this.offsetX += (-x) - this.offsetX;
        }

        if(y + this.offsetY < 0)
        {
            for(var i = 0; i < this.width; i++)
            {
                for(var j = 0; j < (-y - this.offsetY); j++)
                {
                    if(this.tiles[i]) this.tiles[i].unshift(undefined);
                }
            }
            this.height += (-y - this.offsetY);
            this.offsetY += (-y) - this.offsetY;
        }

        if(x + this.offsetX > this.width - 1)
        {
            this.width = x + this.offsetX + 1;
        }

        if(y + this.offsetY > this.height - 1)
        {
            this.height = y + this.offsetY + 1;
        }

        if(!this.tiles[x + this.offsetX])
        {
            this.tiles[x + this.offsetX] = [];
        }
        this.tiles[x + this.offsetX][y + this.offsetY] = id;

    }

    this.getTile = function(x, y)
    {
        if(x + this.offsetX > this.width || y + this.offsetY > this.height) return undefined;
        var row = this.tiles[x + this.offsetX];
        if(!row) return undefined;
        if(!row[y + this.offsetY]) return undefined;
        return row[y + this.offsetY];
    }
}

